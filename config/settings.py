import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # QuickNode API Keys
    QUICKNODE_RPC_URL: str = os.getenv("QUICKNODE_RPC_URL", "")
    QUICKNODE_WSS_URL: str = os.getenv("QUICKNODE_WSS_URL", "")

     # Upstash Redis
    UPSTASH_REDIS_URL: str = os.getenv("UPSTASH_REDIS_URL", "")
    UPSTASH_REDIS_TOKEN: str = os.getenv("UPSTASH_REDIS_TOKEN", "")


    # Telegram API Keys
    TELEGRAM_BOT_TOKEN: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    TELEGRAM_CHAT_ID: str = os.getenv("TELEGRAM_CHAT_ID", "")

    # Google Cloud Project
    GOOGLE_CLOUD_PROJECT: str = os.getenv("GOOGLE_CLOUD_PROJECT", "")

    ## NEU ##
    # Externe APIs
    COINGECKO_API_URL: str = "https://api.coingecko.com/api/v3/simple/price"


    ## NEU ##
    # Datenprovider APIs
    DEXSCREENER_API_URL: str = "https://api.dexscreener.com/latest/dex/tokens"
    GOPLUS_API_URL: str = "https://api.gopluslabs.io/api/v1/token_security/1" # 1 = Solana Chain ID


    if not all([QUICKNODE_RPC_URL, QUICKNODE_WSS_URL, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, GOOGLE_CLOUD_PROJECT, UPSTASH_REDIS_URL, UPSTASH_REDIS_TOKEN]):
        raise ValueError("Wichtige API-Schlüssel oder Konfigurationen fehlen in den Umgebungsvariablen.")

settings = Settings()