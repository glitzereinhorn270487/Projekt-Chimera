# bot_services/athena_engine.py (Kompletter Code)
import asyncio
import aiohttp
from database.database_manager import db_manager
from shared_utils.logging_setup import cerebrum
from . import trade_executor

# Verkaufsregeln V1.0
TAKE_PROFIT_PERCENT = 150.0  # +150%
STOP_LOSS_PERCENT = -50.0   # -50%

async def manage_positions():
    """Überwacht kontinuierlich alle offenen Positionen und wendet Verkaufsregeln an."""
    cerebrum.info("Athena Engine (Positions-Manager) gestartet.")
    while True:
        try:
            open_positions = await db_manager.get_open_positions()
            if open_positions:
                cerebrum.info(f"Athena überwacht {len(open_positions)} offene Position(en).")
                
                async with aiohttp.ClientSession() as session:
                    for pos in open_positions:
                        # Wir prüfen nur offene Positionen
                        if pos.get("status") != "open":
                            continue

                        token_address = pos["token_address"]
                        entry_price = float(pos.get("entry_price_usd", 0))
                        if entry_price == 0:
                            continue

                        # Hole aktuellen Preis
                        url = f"https://api.dexscreener.com/latest/dex/tokens/{token_address}"
                        async with session.get(url) as response:
                            if response.status == 200:
                                data = await response.json()
                                if data and data.get("pairs"):
                                    current_price = float(data["pairs"][0].get("priceUsd", 0))
                                    
                                    # Berechne P&L
                                    pnl_percent = ((current_price - entry_price) / entry_price) * 100
                                    cerebrum.debug(f"Position {token_address[:6]}: Aktueller P&L: {pnl_percent:.2f}%")
                                    
                                    # Prüfe Verkaufsbedingungen
                                    if pnl_percent >= TAKE_PROFIT_PERCENT:
                                        await trade_executor.execute_simulated_sell(pos, f"Take Profit ({TAKE_PROFIT_PERCENT}%) erreicht", pnl_percent)
                                    elif pnl_percent <= STOP_LOSS_PERCENT:
                                        await trade_executor.execute_simulated_sell(pos, f"Stop Loss ({STOP_LOSS_PERCENT}%) erreicht", pnl_percent)
            
            await asyncio.sleep(60) # Prüfe alle 60 Sekunden die Positionen

        except Exception as e:
            cerebrum.error(f"Fehler in der Athena Engine: {e}")
            await asyncio.sleep(120)