# bot_services/trade_executor.py (Kompletter Code)
from datetime import datetime, timezone
import aiohttp
from database.database_manager import db_manager
from shared_utils.logging_setup import cerebrum
from .telegram_notifier import send_telegram_message

async def execute_simulated_buy(token_address: str, investment_usd: int, mqs: int, final_score: int, category: str):
    # Hole aktuellen Preis für die Positionsaufzeichnung
    entry_price = 0
    try:
        async with aiohttp.ClientSession() as session:
            url = f"https://api.dexscreener.com/latest/dex/tokens/{token_address}"
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    if data and data.get("pairs"):
                        entry_price = float(data["pairs"][0].get("priceUsd", 0))
    except Exception as e:
        cerebrum.error(f"Konnte Einstiegspreis für {token_address} nicht abrufen: {e}")

    trade_time = datetime.now(timezone.utc)
    cerebrum.success(f"TRADE EXECUTION (SIMULIERT): Kaufe {token_address} für ${investment_usd} zum Preis von ${entry_price}")
    
    trade_data = {
        "token_address": token_address,
        "investment_usd": investment_usd,
        "entry_time_utc": trade_time.isoformat(),
        "status": "open",
        "entry_mqs": mqs,
        "entry_scorex": final_score,
        "category": category,
        "pnl_percent": 0,
        "entry_price_usd": entry_price
    }
    
    await db_manager.add_open_position(trade_data)
    
    message = (
        f"🚀 **SIMULIERTER KAUF** 🚀\n\n"
        f"**Token:** `{token_address}`\n"
        f"**Investment:** `${investment_usd}` @ `${entry_price}`\n"
        f"**Kategorie:** `{category}`\n"
        f"**MQS:** `{mqs}` | **ScoreX:** `{final_score}`"
    )
    await send_telegram_message(message)

async def execute_simulated_sell(position: dict, reason: str, pnl_percent: float):
    """Simuliert einen Verkauf, aktualisiert die Position und sendet eine Benachrichtigung."""
    
    token_address = position["token_address"]
    cerebrum.success(f"TRADE EXECUTION (SIMULIERT): Verkaufe {token_address} aufgrund von: {reason}")
    
    position["status"] = "closed"
    position["pnl_percent"] = pnl_percent
    position["exit_time_utc"] = datetime.now(timezone.utc).isoformat()
    position["exit_reason"] = reason

    await db_manager.add_open_position(position) # Überschreibt die alte Position mit den neuen Daten
    
    pnl_usd = position["investment_usd"] * (pnl_percent / 100)
    
    emoji = "✅" if pnl_percent >= 0 else "❌"
    message = (
        f"{emoji} **POSITION GESCHLOSSEN** {emoji}\n\n"
        f"**Token:** `{token_address}`\n"
        f"**Grund:** `{reason}`\n"
        f"**P&L:** `{pnl_percent:.2f}%` (`${pnl_usd:.2f}`)"
    )
    await send_telegram_message(message)