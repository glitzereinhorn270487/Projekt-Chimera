import asyncio
from shared_utils.logging_setup import cerebrum
from bot_services.gatekeeper_service import listen_for_new_pools
from bot_services.trigger_watcher_service import watch_for_triggers # ## NEUER IMPORT ##
from bot_services.athena_engine import manage_positions # ## NEUER IMPORT ##

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
        
        # Erstelle Tasks für die parallel laufenden Services
        gatekeeper_task = asyncio.create_task(listen_for_new_pools())
        trigger_watcher_task = asyncio.create_task(watch_for_triggers()) # ## NEUER TASK ##
        athena_task = asyncio.create_task(manage_positions()) # ## NEUER TASK ##

        await asyncio.gather(gatekeeper_task, trigger_watcher_task, athena_task) # ## AKTUALISIERT ##
        
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