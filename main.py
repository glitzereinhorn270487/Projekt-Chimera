import asyncio
from shared_utils.logging_setup import cerebrum
from bot_services.gatekeeper_service import listen_for_new_pools

async def main():
    """
    Die Haupt-Einstiegsfunktion für den NonPlusUltra Trading Bot.
    """
    cerebrum.info("==================================================")
    cerebrum.info("Starte den NonPlusUltra Trading Bot - Projekt Chimera")
    cerebrum.info(f"Blueprint Version: V7")
    cerebrum.info("==================================================")

    try:
        cerebrum.info("Bot-Services werden initialisiert...")
        
        # Erstelle eine Aufgabe für den Gatekeeper-Service, damit er im Hintergrund läuft
        gatekeeper_task = asyncio.create_task(listen_for_new_pools())

        # Hier können später weitere Services als Tasks hinzugefügt werden
        await asyncio.gather(gatekeeper_task)

    except KeyboardInterrupt:
        cerebrum.warning("Bot wird manuell heruntergefahren.")
    except Exception as e:
        cerebrum.exception(f"Ein kritischer Fehler ist aufgetreten: {e}")
    finally:
        cerebrum.info("Bot-Betrieb beendet.")


if __name__ == "__main__":
    import os
    if not os.path.exists("logs"):
        os.makedirs("logs")
        
    asyncio.run(main())
