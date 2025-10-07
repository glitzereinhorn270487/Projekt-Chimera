# bot_services/scorex_engine.py
import aiohttp
from config.settings import settings
from shared_utils.logging_setup import cerebrum

async def _check_holder_distribution(token_address: str):
    """
    Prüft die Top-Halter-Verteilung mit der GoPlus Security API.
    Gibt True zurück, wenn die Verteilung als sicher eingestuft wird.
    """
    try:
        url = f"{settings.GOPLUS_API_URL}?contract_addresses={token_address}"
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    result = data.get("result", {}).get(token_address.lower(), {})
                    top_10_percent = float(result.get("top_10_holder_rate", "1")) * 100
                    
                    if top_10_percent > 30.0:
                        cerebrum.warning(f"Gini-Wächter: Top 10 Halter besitzen {top_10_percent:.2f}%. Hohes Risiko.")
                        return False
                    cerebrum.info(f"Gini-Wächter: Top 10 Halter-Analyse bestanden ({top_10_percent:.2f}%).")
                    return True
                return True # Fail-safe: Bei API-Fehler trotzdem passieren lassen
    except Exception as e:
        cerebrum.error(f"Fehler bei der GoPlus Halter-Analyse: {e}")
        return True # Fail-safe

async def run_final_analysis(token_address: str, mqs: int):
    """
    Kombiniert alle Daten zu einem finalen Konfidenz-Score.
    """
    cerebrum.info(f"ScoreX Engine aktiviert für {token_address} mit MQS {mqs}.")
    confidence_score = mqs  # Startwert ist der MQS

    # 1. Gini-Wächter Prüfung
    is_safe_distribution = await _check_holder_distribution(token_address)
    if not is_safe_distribution:
        confidence_score -= 20 # Malus für schlechte Verteilung

    # ... hier können zukünftig weitere Checks hinzugefügt werden ...

    final_score = max(0, min(100, confidence_score)) # Stelle sicher, dass der Score zwischen 0 und 100 liegt
    
    category = "Kein Trade"
    if final_score >= 70:
        category = "Konfidenz-Trade"
    if final_score >= 85:
        category = "Hochkonfidenz-Trade"

    cerebrum.success(f"ScoreX Analyse abgeschlossen für {token_address}: Finaler Score = {final_score}, Kategorie = {category}")
    return final_score, category