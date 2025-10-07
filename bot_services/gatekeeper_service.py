# bot_services/gatekeeper_service.py
import asyncio
from solders.pubkey import Pubkey
from solders.signature import Signature
from solana.rpc.async_api import AsyncClient
from solana.exceptions import SolanaRpcException
from config.settings import settings
from shared_utils.logging_setup import cerebrum
from database.database_manager import db_manager
from .telegram_notifier import send_telegram_message
from shared_utils.price_oracle import get_sol_price_usd

RAYDIUM_LP_V4 = Pubkey.from_string('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8')
MINIMUM_LIQUIDITY_USD = 15000
SOL_MINT_ADDRESS = "So11111111111111111111111111111111111111112"
POLLING_INTERVAL_SECONDS = 10

def _parse_pool_info_from_logs(logs):
    try:
        pubkeys = []
        for log in logs:
            parts = log.replace(":", " ").split()
            for part in parts:
                try:
                    if 32 <= len(part) <= 44 and part.isalnum() and not part.isdigit():
                        if str(RAYDIUM_LP_V4) != part:
                            pubkeys.append(part)
                except:
                    continue
        unique_keys = list(dict.fromkeys(pubkeys))
        if len(unique_keys) >= 6:
            return {
                "lp_mint": unique_keys[3],
                "token_a_mint": unique_keys[4],
                "token_b_mint": unique_keys[5],
                "token_a_account": unique_keys[1],
                "token_b_account": unique_keys[2],
            }
    except Exception as e:
        cerebrum.error(f"Fehler beim Parsen der Logs: {e}")
    return None

async def _get_token_balance_and_decimals(rpc_client: AsyncClient, token_account_address: str):
    try:
        account_pubkey = Pubkey.from_string(token_account_address)
        balance_response = await rpc_client.get_token_account_balance(account_pubkey)
        balance = balance_response.value.ui_amount
        decimals = balance_response.value.decimals
        return balance, decimals
    except Exception as e:
        cerebrum.error(f"Fehler beim Abrufen der Kontodetails für {token_account_address}: {e}")
    return 0, 0

async def _check_liquidity(pool_info: dict):
    try:
        sol_price = await get_sol_price_usd()
        if not sol_price:
            return False, "$0.00"
        rpc_client = AsyncClient(settings.QUICKNODE_RPC_URL)
        balance_a, _ = await _get_token_balance_and_decimals(rpc_client, pool_info["token_a_account"])
        balance_b, _ = await _get_token_balance_and_decimals(rpc_client, pool_info["token_b_account"])
        await rpc_client.close()
        total_liquidity_usd = 0
        if pool_info["token_a_mint"] == SOL_MINT_ADDRESS:
            total_liquidity_usd = (balance_a * sol_price) * 2
        elif pool_info["token_b_mint"] == SOL_MINT_ADDRESS:
            total_liquidity_usd = (balance_b * sol_price) * 2
        else:
            return True, "N/A (Non-SOL Pair)"
        liquidity_value_str = f"${total_liquidity_usd:,.2f}"
        cerebrum.info(f"Echte Liquidität für LP {pool_info.get('lp_mint')}: {liquidity_value_str}")
        if total_liquidity_usd >= MINIMUM_LIQUIDITY_USD:
            return True, liquidity_value_str
        else:
            return False, liquidity_value_str
    except Exception as e:
        cerebrum.critical(f"Kritischer Fehler bei der Liquiditätsprüfung: {e}")
        return False, "$0.00"

async def check_token(pool_info: dict) -> bool:
    token_address = pool_info.get("token_b_mint")
    if pool_info.get("token_a_mint") != SOL_MINT_ADDRESS:
        token_address = pool_info.get("token_a_mint")
    cerebrum.info(f"Führe Gatekeeper-Prüfung für Token {token_address} durch...")
    liquidity_ok, liquidity_value = await _check_liquidity(pool_info)
    if not liquidity_ok:
        cerebrum.warning(f"[CHECK 1/5 FAILED] Liquidität ({liquidity_value}) unter dem Minimum von ${MINIMUM_LIQUIDITY_USD:,.2f}")
        return False
    cerebrum.success(f"[CHECK 1/5 PASSED] Liquidität: {liquidity_value}")
    cerebrum.warning(f"[CHECK 2/5] Honeypot-Check für {token_address} noch nicht implementiert. Angenommen: PASS")
    cerebrum.warning(f"[CHECK 3/5] Steuer-Check für {token_address} noch nicht implementiert. Angenommen: PASS")
    cerebrum.warning(f"[CHECK 4/5] Verifizierungs-Check für {token_address} noch nicht implementiert. Angenommen: PASS")
    cerebrum.warning(f"[CHECK 5/5] Dezentralisierungs-Check für {token_address} noch nicht implementiert. Angenommen: PASS")
    cerebrum.success(f"GATEKEEPER-PRÜFUNG BESTANDEN für Token {token_address}")
    return True

async def listen_for_new_pools():
    rpc_client = AsyncClient(settings.QUICKNODE_RPC_URL)
    last_processed_signature = None
    cerebrum.info("Gatekeeper startet im Polling-Modus...")
    while True:
        try:
            cerebrum.debug("Suche nach neuen Pools...")
            signatures_response = await rpc_client.get_signatures_for_address(RAYDIUM_LP_V4, limit=25)
            signatures = signatures_response.value
            if not signatures:
                await asyncio.sleep(POLLING_INTERVAL_SECONDS)
                continue
            
            new_signatures = reversed([s.signature for s in signatures])
            
            temp_sig_list = list(new_signatures)
            if last_processed_signature:
                try:
                    if last_processed_signature in temp_sig_list:
                        index = temp_sig_list.index(last_processed_signature)
                        new_signatures = temp_sig_list[index + 1:]
                    else:
                        new_signatures = temp_sig_list
                except ValueError:
                     new_signatures = temp_sig_list
            
            for sig in new_signatures:
                transaction_response = await rpc_client.get_transaction(sig, max_supported_transaction_version=0)
                transaction = transaction_response.value

                meta = getattr(transaction, 'meta', None)
                if meta and getattr(meta, 'log_messages', None):
                    logs = meta.log_messages
                    if any("initialize2" in log for log in logs):
                        cerebrum.success(f"Neuer Raydium Liquiditätspool entdeckt! Signatur: {sig}")
                        pool_info = _parse_pool_info_from_logs(logs)
                        if pool_info:
                            cerebrum.info(f"Pool-Informationen extrahiert: LP Mint {pool_info.get('lp_mint')}")
                            if await check_token(pool_info):
                                token_address = pool_info.get("token_b_mint")
                                if pool_info.get("token_a_mint") != SOL_MINT_ADDRESS:
                                    token_address = pool_info.get("token_a_mint")
                                
                                token_data = {"address": token_address, "status": "watching", "lp_mint": pool_info.get('lp_mint')}
                                await db_manager.add_to_hot_watchlist(token_address)
                                await db_manager.add_to_cold_watchlist(token_data)
                                
                                message = (f"✅ **Neuer Token auf Watchlist** ✅\n\n`{token_address}`\n\nDer Token hat die Gatekeeper-Prüfung bestanden und wird jetzt überwacht.")
                                await send_telegram_message(message)

            last_processed_signature = signatures[0].signature
            await asyncio.sleep(POLLING_INTERVAL_SECONDS)

        except Exception as e:
            cerebrum.critical(f"Ein kritischer Fehler im Gatekeeper-Polling ist aufgetreten: {e}")
            await asyncio.sleep(POLLING_INTERVAL_SECONDS * 2)