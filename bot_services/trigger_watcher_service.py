# bot_services/trigger_watcher_service.py
import asyncio
import aiohttp
from config.settings import settings
from shared_utils.logging_setup import cerebrum
from database.database_manager import db_manager
from . import scorex_engine  # NEU
from . import trade_executor # NEU

MQS_BENCHMARK_VOLUME_H1 = 10000
MQS_BENCHMARK_TX_H24 = 500

def _calculate_mqs(pair_data: dict):
    # ... (unverändert) ...

async def watch_for_triggers():
    cerebrum.info("Trigger Watcher Service gestartet.")
    while True:
        try:
            watchlist = await db_manager.get_hot_watchlist()
            if not watchlist:
                await asyncio.sleep(15)
                continue
            
            cerebrum.info(f"Überwache {len(watchlist)} Token auf der Hot Watchlist...")

            async with aiohttp.ClientSession() as session:
                for token_address in watchlist:
                    url = f"https://api.dexscreener.com/latest/dex/tokens/{token_address}"
                    async with session.get(url) as response:
                        if response.status == 200:
                            data = await response.json()
                            if data and data.get("pairs"):
                                pair_data = data["pairs"][0]
                                mqs = _calculate_mqs(pair_data)
                                
                                cerebrum.info(f"Token: {token_address[:6]}... | MQS: {mqs}")

                                # ## AKTUALISIERTE TRIGGER LOGIK ##
                                if mqs > 70: # Schwelle etwas gesenkt für mehr potenzielle Aktionen
                                    cerebrum.success(f"!! MQS-TRIGGER ENTDECKT !! Token: {token_address}, MQS: {mqs}. Aktiviere ScoreX...")
                                    
                                    # Finale Analyse durch ScoreX
                                    final_score, category = await scorex_engine.run_final_analysis(token_address, mqs)
                                    
                                    if category != "Kein Trade":
                                        # Investmenthöhe basierend auf Kategorie bestimmen ("Blitzkrieg-Modus")
                                        investment_usd = 0
                                        if category == "Konfidenz-Trade":
                                            investment_usd = 25
                                        elif category == "Hochkonfidenz-Trade":
                                            investment_usd = 40
                                        
                                        if investment_usd > 0:
                                            # Trade ausführen (simuliert)
                                            await trade_executor.execute_simulated_buy(token_address, investment_usd, mqs, final_score, category)
                                            # Token von Watchlist entfernen, um Re-Buys zu verhindern
                                            await db_manager.remove_from_hot_watchlist(token_address)
                            # ... (restlicher Code) ...
            
            await asyncio.sleep(60)

        except Exception as e:
            cerebrum.critical(f"Ein kritischer Fehler im Trigger Watcher ist aufgetreten: {e}")
            await asyncio.sleep(60)