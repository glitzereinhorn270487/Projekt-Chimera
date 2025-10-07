# bot_services/athena_engine.py
import asyncio
from database.database_manager import db_manager
from shared_utils.logging_setup import cerebrum

async def manage_positions():
    """
    Überwacht kontinuierlich alle offenen Positionen.
    """
    cerebrum.info("Athena Engine (Positions-Manager) gestartet.")
    while True:
        try:
            open_positions = await db_manager.get_open_positions()
            if open_positions:
                cerebrum.info(f"Athena überwacht {len(open_positions)} offene Position(en).")
                # In Zukunft wird hier die Logik für Trailing-Stops, Take-Profits etc. implementiert
            
            # Prüfe alle 2 Minuten die Positionen
            await asyncio.sleep(120)

        except Exception as e:
            cerebrum.error(f"Fehler in der Athena Engine: {e}")
            await asyncio.sleep(120)