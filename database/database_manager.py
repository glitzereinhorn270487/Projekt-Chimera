import redis.asyncio as redis
from solders.pubkey import Pubkey
from google.cloud import firestore
from shared_utils.logging_setup import cerebrum
from config.settings import settings
import json # New import

class DatabaseManager:
    def __init__(self):
        try:
            self.redis_client = redis.Redis(decode_responses=True)
            cerebrum.info("Lokale Redis-Verbindung (Hot Watchlist) initialisiert.")
        except Exception as e:
            cerebrum.critical(f"Konnte lokale Redis-Verbindung nicht initialisieren: {e}")
            self.redis_client = None

        try:
            self.firestore_client = firestore.AsyncClient()
            cerebrum.info("Erfolgreich mit Firestore verbunden.")
        except Exception as e:
            cerebrum.critical(f"Konnte keine Verbindung zu Firestore herstellen: {e}")
            self.firestore_client = None
            
        try:
            # Use async client for Upstash as well for consistency
            self.upstash_client = redis.from_url(
                url=settings.UPSTASH_REDIS_URL,
                decode_responses=True
            )
            cerebrum.info("Erfolgreich mit Upstash Redis verbunden.")
        except Exception as e:
            cerebrum.critical(f"Konnte keine Verbindung zu Upstash Redis herstellen: {e}")
            self.upstash_client = None

    async def load_special_wallets(self):
        """
        ## NEW LOGIC ##
        Loads and normalizes Insider and Smart-Money wallets from Upstash
        by scanning for keys with the pattern 'db:insider:*'.
        """
        if not self.upstash_client:
            return {}, {} # Return dictionaries instead of sets

        insiders = {}
        smart_money = {}

        try:
            await self.upstash_client.ping()
            
            # Scan for insider wallets
            async for key in self.upstash_client.scan_iter("db:insider:*"):
                wallet_address = key.split(":")[-1]
                try:
                    # No need to normalize if the key is already the source of truth
                    insiders[wallet_address] = json.loads(await self.upstash_client.get(key))
                except (json.JSONDecodeError, TypeError):
                    cerebrum.warning(f"Could not parse JSON for insider key: {key}")

            # Scan for smart money wallets (assuming similar pattern)
            async for key in self.upstash_client.scan_iter("db:smart_money:*"):
                wallet_address = key.split(":")[-1]
                try:
                    smart_money[wallet_address] = json.loads(await self.upstash_client.get(key))
                except (json.JSONDecodeError, TypeError):
                    cerebrum.warning(f"Could not parse JSON for smart_money key: {key}")

            cerebrum.success(f"{len(insiders)} Insider and {len(smart_money)} Smart Money Wallets geladen.")
            return insiders, smart_money

        except Exception as e:
            cerebrum.error(f"Fehler beim Laden der speziellen Wallets von Upstash: {e}")
            return {}, {}

    # --- The rest of the file remains the same ---
    
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