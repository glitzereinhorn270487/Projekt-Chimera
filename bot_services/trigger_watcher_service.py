# bot_services/trigger_watcher_service.py
import asyncio
import aiohttp
from config.settings import settings
from shared_utils.logging_setup import cerebrum
from database.database_manager import db_manager

# MQS Bewertungs-Benchmarks (diese können später im Alpha-Tuner angepasst werden)
MQS_BENCHMARK_VOLUME_H1 = 10000  # $10k Volumen in der letzten Stunde = perfekte Punktzahl
MQS_BENCHMARK_TX_H24 = 500      # 500 Transaktionen in 24h = perfekte Punktzahl

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

async def watch_for_triggers():
    """
    Überwacht die Hot Watchlist kontinuierlich auf Kauf-Trigger (z.B. MQS-Anstieg).
    """
    cerebrum.info("Trigger Watcher Service gestartet.")
    while True:
        try:
            watchlist = await db_manager.get_hot_watchlist()
            if not watchlist:
                await asyncio.sleep(15) # Kurze Pause, wenn die Watchlist leer ist
                continue
            
            cerebrum.info(f"Überwache {len(watchlist)} Token auf der Hot Watchlist...")

            async with aiohttp.ClientSession() as session:
                for token_address in watchlist:
                    # DexScreener API-Endpunkt für Token-Paare
                    url = f"https://api.dexscreener.com/latest/dex/tokens/{token_address}"
                    async with session.get(url) as response:
                        if response.status == 200:
                            data = await response.json()
                            # Wähle das relevanteste Paar (normalerweise das mit der höchsten Liquidität)
                            # Für SOL-Paare ist es oft das erste.
                            if data and data.get("pairs"):
                                # Wir nehmen an, das erste Paar ist das relevanteste (oft das SOL-Paar)
                                pair_data = data["pairs"][0]
                                mqs = _calculate_mqs(pair_data)
                                
                                cerebrum.info(f"Token: {token_address[:6]}... | MQS: {mqs}")

                                # TRIGGER LOGIK
                                if mqs > 75:
                                    cerebrum.success(f"!! KAUF-TRIGGER ENTDECKT !! Token: {token_address}, MQS: {mqs}")
                                    # HIER wird später die ScoreX-Engine aktiviert und der Kauf ausgelöst
                            else:
                                cerebrum.warning(f"Keine Paardaten von DexScreener für {token_address} gefunden.")
                        else:
                            cerebrum.error(f"Fehler beim Abrufen der DexScreener-Daten für {token_address}: Status {response.status}")
            
            # Warte 60 Sekunden bis zur nächsten Überprüfung
            await asyncio.sleep(60)

        except Exception as e:
            cerebrum.critical(f"Ein kritischer Fehler im Trigger Watcher ist aufgetreten: {e}")
            await asyncio.sleep(60) # Längere Pause bei kritischem Fehler