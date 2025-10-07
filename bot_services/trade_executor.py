# bot_services/trade_executor.py
from datetime import datetime, timezone
from database.database_manager import db_manager
from shared_utils.logging_setup import cerebrum
from .telegram_notifier import send_telegram_message

async def execute_simulated_buy(token_address: str, investment_usd: int, mqs: int, final_score: int, category: str):
    """
    Simuliert einen Kauf, speichert die Position und sendet eine Benachrichtigung.
    """
    trade_time = datetime.now(timezone.utc)
    cerebrum.success(f"TRADE EXECUTION (SIMULIERT): Kaufe {token_address} für ${investment_usd}")
    
    trade_data = {
        "token_address": token_address,
        "investment_usd": investment_usd,
        "entry_time_utc": trade_time.isoformat(),
        "status": "open",
        "entry_mqs": mqs,
        "entry_scorex": final_score,
        "category": category,
        "pnl_percent": 0
    }
    
    await db_manager.add_open_position(trade_data)
    
    message = (
        f"🚀 **SIMULIERTER KAUF** 🚀\n\n"
        f"**Token:** `{token_address}`\n"
        f"**Investment:** `${investment_usd}`\n"
        f"**Kategorie:** `{category}`\n"
        f"**MQS:** `{mqs}` | **ScoreX:** `{final_score}`"
    )
    await send_telegram_message(message)