# bot_services/trigger_watcher_service.py
import asyncio
import aiohttp
from config.settings import settings
from shared_utils.logging_setup import cerebrum
from database.database_manager import db_manager
from . import scorex_engine
from . import trade_executor


MQS_BENCHMARK_VOLUME_H1 = 10000
MQS_BENCHMARK_TX_H24 = 500

def _calculate_mqs(pair_data: dict):
    """
    Berechnet den Momentum Quality Score (MQS) basierend auf DexScreener-Daten.
    Score ist von 0-100.
    """
    if not pair_data:
        return 0

    try:
        # Komponente 1: Kaufdruck (Gewichtung 40%)
        buys = pair_data.get("txns", {}).get("h24", {}).get("buys", 0)
        sells = pair_data.get("txns", {}).get("h24", {}).get("sells", 0)
        total_tx = buys + sells
        buy_pressure_score = (buys / total_tx) if total_tx > 0 else 0
        
        # Komponente 2: Volumen-Geschwindigkeit (Gewichtung 30%)
        volume_h1 = pair_data.get("volume", {}).get("h1", 0)
        volume_velocity_score = min(volume_h1 / MQS_BENCHMARK_VOLUME_H1, 1.0)

        # Komponente 3: Transaktions-Geschwindigkeit (Gewichtung 30%)
        tx_h24 = total_tx
        tx_velocity_score = min(tx_h24 / MQS_BENCHMARK_TX_H24, 1.0)
        
        # Finaler MQS Score
        mqs = (buy_pressure_score * 40) + (volume_velocity_score * 30) + (tx_velocity_score * 30)
        return int(mqs)

    except Exception as e:
        cerebrum.error(f"Fehler bei der MQS-Berechnung: {e}")
        return 0

def _check_for_special_wallet_activity(pair_data: dict, insiders: set, smart_money: set):
    """Prüft die letzten Transaktionen auf Aktivitäten von bekannten Wallets."""
    recent_txns = pair_data.get("transactions", [])
    if not recent_txns:
        return None

    for txn in recent_txns:
        # Wir prüfen nur Käufe (tx_type == 'buy')
        if txn.get('txType') == 'buy':
            buyer = txn.get('maker', {}).get('address')
            if buyer:
                if buyer in insiders:
                    cerebrum.info(f"INSIDER-KAUF entdeckt von {buyer[:6]}...")
                    return "Insider Buy"
                if buyer in smart_money:
                    cerebrum.info(f"SMART MONEY-KAUF entdeckt von {buyer[:6]}...")
                    return "Smart Money Buy"
    return None

async def watch_for_triggers():
    cerebrum.info("Trigger Watcher Service gestartet.")
    # Lade die speziellen Wallets einmal beim Start
    insiders, smart_money = db_manager.load_special_wallets()
    
    while True:
        try:
            watchlist = await db_manager.get_hot_watchlist()
            if not watchlist:
                await asyncio.sleep(15) # Kurze Pause, wenn die Watchlist leer ist
                continue
            
            cerebrum.info(f"Überwache {len(watchlist)} Token auf der Hot Watchlist...")

            
            for token_address in watchlist:
                   async with aiohttp.ClientSession() as session:
                for token_address in watchlist:
                    # DexScreener API-Endpunkt für Token-Paare
                    url = f"https://api.dexscreener.com/latest/dex/tokens/{token_address}"
                    async with session.get(url) as response:
                        if response.status == 200:
                            data = await response.json()
                            if data and data.get("pairs"):
                                pair_data = data["pairs"][0]
                                mqs = _calculate_mqs(pair_data)
                                
                                cerebrum.info(f"Token: {token_address[:6]}... | MQS: {mqs}")

                                # TRIGGER LOGIK
                                if mqs > 70:
                                    cerebrum.success(f"!! MQS-TRIGGER ENTDECKT !! Token: {token_address}, MQS: {mqs}. Aktiviere ScoreX...")
                                    
                                    final_score, category = await scorex_engine.run_final_analysis(token_address, mqs)
                                    
                                    if category != "Kein Trade":
                                        investment_usd = 0
                                        if category == "Konfidenz-Trade":
                                            investment_usd = 25
                                        elif category == "Hochkonfidenz-Trade":
                                            investment_usd = 40
                                        
                                        if investment_usd > 0:
                                            await trade_executor.execute_simulated_buy(token_address, investment_usd, mqs, final_score, category)
                                            await db_manager.remove_from_hot_watchlist(token_address)
                            else:
                                cerebrum.warning(f"Keine Paardaten von DexScreener für {token_address} gefunden.")
                        else:
                            cerebrum.error(f"Fehler beim Abrufen der DexScreener-Daten für {token_address}: Status {response.status}")
            
            await asyncio.sleep(60)
                if data and data.get("pairs"):
                    pair_data = data["pairs"][0]
                    
                    # Berechne TAS (Trigger Aggregator Score)
                    tas = 0
                    mqs = _calculate_mqs(pair_data)
                    if mqs > 70:
                        tas += 2
                    
                    db_trigger = _check_for_special_wallet_activity(pair_data, insiders, smart_money)
                    if db_trigger == "Insider Buy":
                        tas += 4
                    elif db_trigger == "Smart Money Buy":
                        tas += 3
                    
                    cerebrum.info(f"Token: {token_address[:6]}... | MQS: {mqs} | TAS: {tas}")

                    if tas >= 4: # Kaufschwelle für TAS
                        cerebrum.success(f"!! KAUF-TRIGGER ENTDECKT !! Token: {token_address}, TAS: {tas}. Aktiviere ScoreX...")

        except Exception as e:
            cerebrum.critical(f"Ein kritischer Fehler im Trigger Watcher ist aufgetreten: {e}")
            await asyncio.sleep(60)