import asyncio
import aiohttp
from config.settings import settings
from shared_utils.logging_setup import cerebrum
from database.database_manager import db_manager
from . import scorex_engine
from . import trade_executor

# MQS-Benchmarks
MQS_BENCHMARK_VOLUME_H1 = 10000
MQS_BENCHMARK_TX_H24 = 500
# TAS-Schwelle zur Aktivierung von ScoreX
TAS_SCOREX_THRESHOLD = 4

def _calculate_mqs(pair_data: dict):
    if not pair_data: return 0
    try:
        buys = pair_data.get("txns", {}).get("h24", {}).get("buys", 0)
        sells = pair_data.get("txns", {}).get("h24", {}).get("sells", 0)
        total_tx = buys + sells
        buy_pressure_score = (buys / total_tx) if total_tx > 0 else 0
        volume_h1 = pair_data.get("volume", {}).get("h1", 0)
        volume_velocity_score = min(volume_h1 / MQS_BENCHMARK_VOLUME_H1, 1.0)
        tx_velocity_score = min(total_tx / MQS_BENCHMARK_TX_H24, 1.0)
        mqs = (buy_pressure_score * 40) + (volume_velocity_score * 30) + (tx_velocity_score * 30)
        return int(mqs)
    except Exception as e:
        cerebrum.error(f"Fehler bei MQS-Berechnung: {e}")
        return 0

def _check_for_special_wallet_activity(pair_data: dict, insiders: set, smart_money: set):
    recent_txns = pair_data.get("transactions", [])
    if not recent_txns: return None, 0
    for txn in recent_txns:
        if txn.get('txType') == 'buy':
            buyer = txn.get('maker', {}).get('address')
            if buyer:
                if buyer in insiders:
                    cerebrum.info(f"INSIDER-KAUF entdeckt von {buyer[:6]}...")
                    return "Insider Buy", 4 # Insider-Käufe geben den höchsten TAS-Bonus
                if buyer in smart_money:
                    cerebrum.info(f"SMART MONEY-KAUF entdeckt von {buyer[:6]}...")
                    return "Smart Money Buy", 3
    return None, 0

async def watch_for_triggers():
    cerebrum.info("Trigger Watcher Service gestartet.")
    insiders, smart_money = await db_manager.load_special_wallets()
    
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
                                
                                # ## NEUE TAS & SCOREX LOGIK ##
                                # 1. Berechne TAS als schneller Filter
                                tas = 0
                                mqs = _calculate_mqs(pair_data)
                                if mqs > 75: tas += 2
                                
                                db_trigger, db_tas_bonus = _check_for_special_wallet_activity(pair_data, insiders, smart_money)
                                tas += db_tas_bonus
                                
                                cerebrum.info(f"Token: {token_address[:6]}... | MQS: {mqs} | TAS: {tas}")

                                # 2. TAS-Schwelle prüfen ("Türsteher")
                                if tas >= TAS_SCOREX_THRESHOLD:
                                    cerebrum.success(f"!! TAS-SCHWELLE ERREICHT !! Token: {token_address}, TAS: {tas}. Aktiviere ScoreX...")
                                    
                                    # 3. ScoreX aktivieren ("VIP-Manager")
                                    final_score, category = await scorex_engine.run_final_analysis(token_address, mqs)
                                    
                                    # 4. Finale Entscheidung basierend auf ScoreX
                                    if category != "Kein Trade":
                                        investment_usd = 0
                                        if category == "Konfidenz-Trade": investment_usd = 25
                                        elif category == "Hochkonfidenz-Trade": investment_usd = 40
                                        
                                        if investment_usd > 0:
                                            await trade_executor.execute_simulated_buy(token_address, investment_usd, mqs, final_score, category)
                                            await db_manager.remove_from_hot_watchlist(token_address)
                        else:
                            cerebrum.error(f"DexScreener-Fehler für {token_address}: Status {response.status}")
            
            await asyncio.sleep(60)
        except Exception as e:
            cerebrum.critical(f"Kritischer Fehler im Trigger Watcher: {e}")
            await asyncio.sleep(60)