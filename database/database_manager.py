import redis.asyncio as redis
from solders.pubkey import Pubkey
from google.cloud import firestore
from google.oauth2 import service_account
from shared_utils.logging_setup import cerebrum
from config.settings import settings
import os
import json
from google.api_core.client_options import ClientOptions # NEUER IMPORT
from google.api_core.exceptions import DeadlineExceeded # NEUER IMPORT

class DatabaseManager:
    def __init__(self):
        # ... (Redis und Upstash Verbindungen bleiben unverändert) ...
        try:
            local_redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
            if "localhost" in local_redis_url:
                cerebrum.warning("REDIS_URL nicht gefunden, wechsle zu localhost für Hot-Watchlist.")
            self.redis_client = redis.from_url(local_redis_url, decode_responses=True)
            cerebrum.info("Lokale Redis-Verbindung (Hot Watchlist) initialisiert.")
        except Exception as e:
            cerebrum.critical(f"Konnte lokale Redis-Verbindung nicht initialisieren: {e}")
            self.redis_client = None

        try:
            # ## NEUE TIMEOUT-LOGIK ##
            # Setze ein höheres API-Timeout, um "Cold Start"-Probleme zu vermeiden
            firestore_options = ClientOptions(api_endpoint=None, api_key=None, credentials_file=None, quota_project_id=None, client_cert_source=None, scopes=None, without_authentication=False, timeout=600.0)

            credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
            if credentials_path and os.path.exists(credentials_path):
                credentials = service_account.Credentials.from_service_account_file(credentials_path)
                self.firestore_client = firestore.AsyncClient(credentials=credentials, project=settings.GOOGLE_CLOUD_PROJECT, client_options=firestore_options)
                cerebrum.info("Erfolgreich mit Firestore über Secret File verbunden.")
            else:
                self.firestore_client = firestore.AsyncClient(project=settings.GOOGLE_CLOUD_PROJECT, client_options=firestore_options)
                cerebrum.info("Erfolgreich mit Firestore (lokale ADC) verbunden.")
        except Exception as e:
            cerebrum.critical(f"Konnte keine Verbindung zu Firestore herstellen: {e}")
            self.firestore_client = None
            
        try:
            self.upstash_client = redis.from_url(
                url=settings.UPSTASH_REDIS_URL,
                decode_responses=True
            )
            cerebrum.info("Erfolgreich mit Upstash Redis verbunden.")
        except Exception as e:
            cerebrum.critical(f"Konnte keine Verbindung zu Upstash Redis herstellen: {e}")
            self.upstash_client = None
    
    # ... Der Rest der Datei bleibt unverändert ...
    async def load_special_wallets(self):
        if not self.upstash_client: return set(), set()
        try:
            await self.upstash_client.ping()
            insider_wallets_raw = await self.upstash_client.smembers("insider_wallets")
            smart_money_wallets_raw = await self.upstash_client.smembers("smart_money_wallets")

            def normalize(addr):
                try: return str(Pubkey.from_string(addr.strip()))
                except: cerebrum.warning(f"Ungültige Wallet-Adresse in DB: {addr}"); return None
            
            insiders = {n for addr in insider_wallets_raw if (n := normalize(addr))}
            smart_money = {n for addr in smart_money_wallets_raw if (n := normalize(addr))}
            
            cerebrum.success(f"{len(insiders)} Insider und {len(smart_money)} Smart Money Wallets geladen.")
            return insiders, smart_money
        except Exception as e:
            cerebrum.error(f"Fehler beim Laden der speziellen Wallets von Upstash: {e}")
            return set(), set()
            
    async def add_to_hot_watchlist(self, token_address: str):
        if not self.redis_client: return
        try: await self.redis_client.sadd("hot_watchlist", token_address)
        except Exception as e: cerebrum.error(f"Fehler bei Redis: {e}")

    async def remove_from_hot_watchlist(self, token_address: str):
        if not self.redis_client: return
        try: await self.redis_client.srem("hot_watchlist", token_address)
        except Exception as e: cerebrum.error(f"Fehler bei Redis: {e}")

    async def add_to_cold_watchlist(self, token_data: dict):
        if not self.firestore_client: return
        try:
            token_address = token_data.get("address")
            if not token_address: return
            doc_ref = self.firestore_client.collection("tokens").document(token_address)
            await doc_ref.set(token_data)
        except Exception as e: cerebrum.error(f"Fehler bei Firestore: {e}")

    async def get_hot_watchlist(self):
        if not self.redis_client: return []
        try:
            await self.redis_client.ping()
            tokens = await self.redis_client.smembers("hot_watchlist")
            return list(tokens)
        except Exception as e:
            cerebrum.error(f"Fehler beim Lesen der Hot Watchlist von Redis: {e}")
            return []

    async def add_open_position(self, trade_data: dict):
        if not self.firestore_client: return
        try:
            token_address = trade_data.get("token_address")
            doc_ref = self.firestore_client.collection("portfolio").document(token_address)
            await doc_ref.set(trade_data)
        except Exception as e: cerebrum.error(f"Fehler beim Speichern der Position in Firestore: {e}")

    async def get_open_positions(self):
        if not self.firestore_client: return []
        try:
            positions_ref = self.firestore_client.collection("portfolio")
            return [doc.to_dict() async for doc in positions_ref.stream()]
        except DeadlineExceeded:
            cerebrum.warning("Firestore-Timeout beim Abrufen von Positionen. Das kann bei Cold Starts passieren. Versuche es im nächsten Zyklus erneut.")
            return []
        except Exception as e:
            cerebrum.error(f"Fehler beim Abrufen der Positionen von Firestore: {e}")
            return []

db_manager = DatabaseManager()