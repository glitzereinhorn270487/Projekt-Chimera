# shared_utils/price_oracle.py
import aiohttp
from config.settings import settings
from shared_utils.logging_setup import cerebrum

async def get_sol_price_usd():
    """
    Holt den aktuellen Preis von SOL in USD von der CoinGecko API.
    """
    params = {
        "ids": "solana",
        "vs_currencies": "usd"
    }
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(settings.COINGECKO_API_URL, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    price = data.get("solana", {}).get("usd")
                    if price:
                        cerebrum.debug(f"Aktueller SOL Preis: ${price}")
                        return float(price)
                cerebrum.error(f"Fehler beim Abrufen des SOL-Preises von CoinGecko: Status {response.status}")
                return None
    except Exception as e:
        cerebrum.error(f"Ausnahme beim Abrufen des SOL-Preises: {e}")
        return None