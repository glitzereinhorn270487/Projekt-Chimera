import redis.asyncio as redis
from solders.pubkey import Pubkey
from google.cloud import firestore
from google.oauth2 import service_account
from shared_utils.logging_setup import cerebrum
from config.settings import settings
import os
import json
import base64 # NEUER IMPORT

class DatabaseManager:
    def __init__(self):
        # ... (Redis und Upstash Verbindungen) ...
        try:
            local_redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
            self.redis_client = redis.from_url(local_redis_url, decode_responses=True)
            cerebrum.info("Lokale Redis-Verbindung initialisiert.")
        except Exception as e:
            self.redis_client = None; cerebrum.critical(f"Redis-Verbindung fehlgeschlagen: {e}")

        try:
            # ## FINALE AUTHENTIFIZIERUNGS-LOGIK (BASE64) ##
            base64_creds = os.getenv("GOOGLE_CREDENTIALS_BASE64")
            if base64_creds:
                decoded_creds_json = base64.b64decode(base64_creds).decode('utf-8')
                creds_dict = json.loads(decoded_creds_json)
                credentials = service_account.Credentials.from_service_account_info(creds_dict)
                self.firestore_client = firestore.AsyncClient(credentials=credentials, project=settings.GOOGLE_CLOUD_PROJECT)
                cerebrum.success("Erfolgreich mit Firestore über Base64-Credentials verbunden.")
            else:
                self.firestore_client = firestore.AsyncClient()
                cerebrum.info("Erfolgreich mit Firestore (lokale ADC) verbunden.")
        except Exception as e:
            self.firestore_client = None; cerebrum.critical(f"Firestore-Verbindung fehlgeschlagen: {e}")
            
        try:
            self.upstash_client = redis.from_url(url=settings.UPSTASH_REDIS_URL, decode_responses=True)
            cerebrum.info("Erfolgreich mit Upstash Redis verbunden.")
        except Exception as e:
            self.upstash_client = None; cerebrum.critical(f"Upstash-Verbindung fehlgeschlagen: {e}")
    
    # ... Der Rest der Datei bleibt unverändert ...
    # (alle async def Funktionen)
    
    # ... Der Rest der Datei bleibt unverändert ...
    async def load_special_wallets(self):
        if not self.upstash_client: return set(), set()
        try:
            await self.upstash_client.ping()
            insider_wallets_raw = await self.upstash_client.smembers("insider_wallets")
            smart_money_wallets_raw = await self.upstash_client.smembers("smart_money_wallets")

            def normalize(addr):
                try: return str(Pubkey.from_string(addr.strip()))
                except: return None
            
            insiders = {n for addr in insider_wallets_raw if (n := normalize(addr))}
            smart_money = {n for addr in smart_money_wallets_raw if (n := normalize(addr))}
            
            cerebrum.success(f"{len(insiders)} Insider und {len(smart_money)} Smart Money Wallets geladen.")
            return insiders, smart_money
        except Exception as e:
            cerebrum.error(f"Fehler beim Laden der speziellen Wallets: {e}")
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
            return list(await self.redis_client.smembers("hot_watchlist"))
        except Exception as e:
            cerebrum.error(f"Fehler beim Lesen der Hot Watchlist: {e}")
            return []

    async def add_open_position(self, trade_data: dict):
        if not self.firestore_client: return
        try:
            token_address = trade_data.get("token_address")
            doc_ref = self.firestore_client.collection("portfolio").document(token_address)
            await doc_ref.set(trade_data)
        except Exception as e: cerebrum.error(f"Fehler beim Speichern der Position: {e}")

    async def get_open_positions(self):
        if not self.firestore_client: return []
        try:
            positions_ref = self.firestore_client.collection("portfolio")
            return [doc.to_dict() async for doc in positions_ref.stream()]
        except Exception as e:
            cerebrum.error(f"Fehler beim Abrufen der Positionen: {e}")
            return []

db_manager = DatabaseManager()