import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # A dictionary to hold all keys we need to check
    REQUIRED_SECRETS = {
        "QUICKNODE_RPC_URL": os.getenv("QUICKNODE_RPC_URL"),
        "QUICKNODE_WSS_URL": os.getenv("QUICKNODE_WSS_URL"),
        "TELEGRAM_BOT_TOKEN": os.getenv("TELEGRAM_BOT_TOKEN"),
        "TELEGRAM_CHAT_ID": os.getenv("TELEGRAM_CHAT_ID"),
        "GOOGLE_CLOUD_PROJECT": os.getenv("GOOGLE_CLOUD_PROJECT"),
        "UPSTASH_REDIS_URL": os.getenv("UPSTASH_REDIS_URL"),
        "GOOGLE_APPLICATION_CREDENTIALS_JSON": os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON"),
    }

    # Check for missing secrets and report exactly which ones are missing
    missing_keys = [key for key, value in REQUIRED_SECRETS.items() if not value]
    if missing_keys:
        raise ValueError(f"Missing environment variables: {', '.join(missing_keys)}")

    # Assign to attributes if all are present
    QUICKNODE_RPC_URL: str = REQUIRED_SECRETS["QUICKNODE_RPC_URL"]
    QUICKNODE_WSS_URL: str = REQUIRED_SECRETS["QUICKNODE_WSS_URL"]
    TELEGRAM_BOT_TOKEN: str = REQUIRED_SECRETS["TELEGRAM_BOT_TOKEN"]
    TELEGRAM_CHAT_ID: str = REQUIRED_SECRETS["TELEGRAM_CHAT_ID"]
    GOOGLE_CLOUD_PROJECT: str = REQUIRED_SECRETS["GOOGLE_CLOUD_PROJECT"]
    UPSTASH_REDIS_URL: str = REQUIRED_SECRETS["UPSTASH_REDIS_URL"]
    GOOGLE_APPLICATION_CREDENTIALS_JSON: str = REQUIRED_SECRETS["GOOGLE_APPLICATION_CREDENTIALS_JSON"]
    
    # Static config
    DEXSCREENER_API_URL: str = "https://api.dexscreener.com/latest/dex/tokens"
    GOPLUS_API_URL: str = "https://api.gopluslabs.io/api/v1/token_security/1"

settings = Settings()