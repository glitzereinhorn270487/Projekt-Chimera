import asyncio
from loguru import logger
from config.settings import settings
from shared_utils.logging_setup import cerebrum

async def main():
    """
    Die Haupt-Einstiegsfunktion für den NonPlusUltra Trading Bot.
    """
    cerebrum.info("==================================================")
    cerebrum.info("Starte den NonPlusUltra Trading Bot - Projekt Chimera")
    cerebrum.info(f"Blueprint Version: V7")
    cerebrum.info("==================================================")

    try:
        # Hier werden wir später unsere Services (Gatekeeper, Trigger-Watcher etc.) starten
        cerebrum.info("Bot-Services werden initialisiert...")
        
        # Simuliert den laufenden Bot
        while True:
            await asyncio.sleep(60)
            cerebrum.info("Herzschlag: Bot ist aktiv und überwacht...")

    except KeyboardInterrupt:
        cerebrum.warning("Bot wird manuell heruntergefahren.")
    except Exception as e:
        cerebrum.exception(f"Ein kritischer Fehler ist aufgetreten: {e}")
    finally:
        cerebrum.info("Bot-Betrieb beendet.")


if __name__ == "__main__":
    # Erstelle einen Ordner für die Logs, falls er nicht existiert
    import os
    if not os.path.exists("logs"):
        os.makedirs("logs")
        
    asyncio.run(main())
