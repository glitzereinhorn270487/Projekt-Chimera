import os
from dotenv import load_dotenv

# Lade Umgebungsvariablen aus einer .env-Datei für die lokale Entwicklung
# Auf dem Server werden diese direkt als Umgebungsvariablen gesetzt
load_dotenv()

class Settings:
    """
    Zentrale Konfigurationsklasse. Lädt alle wichtigen Umgebungsvariablen.
    """
    # QuickNode API Keys
    QUICKNODE_RPC_URL: str = os.getenv("QUICKNODE_RPC_URL", "")
    QUICKNODE_WSS_URL: str = os.getenv("QUICKNODE_WSS_URL", "")

    # Telegram API Keys
    TELEGRAM_BOT_TOKEN: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    TELEGRAM_CHAT_ID: str = os.getenv("TELEGRAM_CHAT_ID", "")

    # Überprüfen, ob alle wichtigen Schlüssel geladen wurden
    if not all([QUICKNODE_RPC_URL, QUICKNODE_WSS_URL, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID]):
        raise ValueError("Wichtige API-Schlüssel oder Konfigurationen fehlen in den Umgebungsvariablen.")

# Erstelle eine Instanz der Settings, die wir im gesamten Projekt importieren können
settings = Settings()
