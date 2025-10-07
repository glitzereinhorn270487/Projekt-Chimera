import aiohttp
from config.settings import settings
from shared_utils.logging_setup import cerebrum

async def send_telegram_message(message: str):
    """
    Sendet eine formatierte Nachricht an den konfigurierten Telegram-Chat.
    """
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": settings.TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "Markdown"
    }
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=payload) as response:
                if response.status != 200:
                    cerebrum.error(f"Fehler beim Senden der Telegram-Nachricht: {await response.text()}")
                else:
                    cerebrum.debug("Telegram-Nachricht erfolgreich gesendet.")
    except Exception as e:
        cerebrum.error(f"Ausnahme beim Senden der Telegram-Nachricht: {e}")
