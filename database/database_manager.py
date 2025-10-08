import redis.asyncio as redis
from solders.pubkey import Pubkey
from google.cloud import firestore
from shared_utils.logging_setup import cerebrum
from config.settings import settings
import os # os importieren

class DatabaseManager:
    def __init__(self):
        try:
            # ## NEUE LOGIK ##
            # Nutze die REDIS_URL, die von Renders Umgebung bereitgestellt wird
            local_redis_url = os.getenv("REDIS_URL")
            if not local_redis_url:
                # Fallback für die lokale Entwicklung
                local_redis_url = "redis://localhost:6379"
                cerebrum.warning("REDIS_URL nicht gefunden, wechsle zu localhost.")
            
            self.redis_client = redis.from_url(local_redis_url, decode_responses=True)
            cerebrum.info("Lokale Redis-Verbindung (Hot Watchlist) initialisiert.")
        except Exception as e:
            cerebrum.critical(f"Konnte lokale Redis-Verbindung nicht initialisieren: {e}")
            self.redis_client = None

        # ... Der Rest der Datei bleibt exakt gleich ...
        try:
            self.firestore_client = firestore.AsyncClient()
            cerebrum.info("Erfolgreich mit Firestore verbunden.")
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
    
    # Alle anderen Funktionen (load_special_wallets, add_to_hot_watchlist, etc.) sind unverändert
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
        except Exception as e:
            cerebrum.error(f"Fehler beim Abrufen der Positionen von Firestore: {e}")
            return []

db_manager = DatabaseManager()