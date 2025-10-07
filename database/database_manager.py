import redis.asyncio as redis
from google.cloud import firestore
from shared_utils.logging_setup import cerebrum
from config.settings import settings

class DatabaseManager:
    def __init__(self):
        try:
            # Verbindung zu Redis (Hot Watchlist)
            self.redis_client = redis.Redis(decode_responses=True)
            cerebrum.info("Erfolgreich mit Redis verbunden.")
        except Exception as e:
            cerebrum.critical(f"Konnte keine Verbindung zu Redis herstellen: {e}")
            self.redis_client = None

        try:
            # Verbindung zu Firestore (Cold Watchlist)
            # HINWEIS: Dies erfordert, dass du `gcloud auth application-default login`
            # einmal lokal in deinem Terminal ausgeführt hast.
            self.firestore_client = firestore.AsyncClient()
            cerebrum.info("Erfolgreich mit Firestore verbunden.")
        except Exception as e:
            cerebrum.critical(f"Konnte keine Verbindung zu Firestore herstellen: {e}")
            self.firestore_client = None

    async def add_to_hot_watchlist(self, token_address: str):
        if not self.redis_client:
            cerebrum.error("Redis-Client nicht verfügbar.")
            return
        try:
            await self.redis_client.sadd("hot_watchlist", token_address)
            cerebrum.success(f"Token {token_address} zur Hot Watchlist (Redis) hinzugefügt.")
        except Exception as e:
            cerebrum.error(f"Fehler beim Hinzufügen zu Redis: {e}")

             ## NEU ##
    async def remove_from_hot_watchlist(self, token_address: str):
        if not self.redis_client:
            cerebrum.error("Redis-Client nicht verfügbar.")
            return
        try:
            await self.redis_client.srem("hot_watchlist", token_address)
            cerebrum.info(f"Token {token_address} von Hot Watchlist (Redis) entfernt.")
        except Exception as e:
            cerebrum.error(f"Fehler beim Entfernen von Redis: {e}")

            ## NEU ##
    async def get_hot_watchlist(self):
        if not self.redis_client:
            cerebrum.error("Redis-Client nicht verfügbar.")
            return []
        try:
            tokens = await self.redis_client.smembers("hot_watchlist")
            return list(tokens)
        except Exception as e:
            cerebrum.error(f"Fehler beim Lesen der Hot Watchlist von Redis: {e}")
            return []


    async def add_to_cold_watchlist(self, token_data: dict):
        if not self.firestore_client:
            cerebrum.error("Firestore-Client nicht verfügbar.")
            return
        try:
            token_address = token_data.get("address")
            if not token_address:
                cerebrum.error("Keine Token-Adresse in den Daten für Firestore gefunden.")
                return
            doc_ref = self.firestore_client.collection("tokens").document(token_address)
            await doc_ref.set(token_data)
            cerebrum.info(f"Token {token_address} zur Cold Watchlist (Firestore) hinzugefügt.")
        except Exception as e:
            cerebrum.error(f"Fehler beim Schreiben nach Firestore: {e}")

            async def add_open_position(self, trade_data: dict):
        if not self.firestore_client:
            cerebrum.error("Firestore-Client nicht verfügbar.")
            return
        try:
            token_address = trade_data.get("token_address")
            doc_ref = self.firestore_client.collection("portfolio").document(token_address)
            await doc_ref.set(trade_data)
            cerebrum.success(f"Neue Position {token_address} im Portfolio (Firestore) gespeichert.")
        except Exception as e:
            cerebrum.error(f"Fehler beim Speichern der Position in Firestore: {e}")
    
    ## NEU ##
    async def get_open_positions(self):
        if not self.firestore_client:
            cerebrum.error("Firestore-Client nicht verfügbar.")
            return []
        try:
            positions_ref = self.firestore_client.collection("portfolio")
            positions = [doc.to_dict() async for doc in positions_ref.stream()]
            return positions
        except Exception as e:
            cerebrum.error(f"Fehler beim Abrufen der Positionen von Firestore: {e}")
            return []

db_manager = DatabaseManager()
