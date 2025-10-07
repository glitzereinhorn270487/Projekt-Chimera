# bot_services/gatekeeper_service.py
import asyncio
import json
import websockets
from solders.pubkey import Pubkey
from solana.rpc.async_api import AsyncClient
from solana.exceptions import SolanaRpcException
from config.settings import settings
from shared_utils.logging_setup import cerebrum
from database.database_manager import db_manager
from .telegram_notifier import send_telegram_message
from shared_utils.price_oracle import get_sol_price_usd # ## NEUER IMPORT ##

RAYDIUM_LP_V4 = Pubkey.from_string('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8')
MINIMUM_LIQUIDITY_USD = 15000
# Die Mint-Adresse für Wrapped SOL (WSOL)
SOL_MINT_ADDRESS = "So11111111111111111111111111111111111111112"

# ## ALLES UNTEN WURDE AKTUALISIERT ODER IST NEU ##

def _parse_pool_info_from_logs(logs):
    """
    Verbesserte Log-Analyse, um die Token-Mint-Adressen zu extrahieren.
    Diese Logik ist eine Heuristik und muss kontinuierlich verfeinert werden.
    """
    try:
        # Finde die Zeile mit den Instruktionsdaten, die die Schlüssel enthält
        for log in logs:
            if "Program data:" in log:
                # Die Schlüssel sind Base64-kodiert oder in anderer Form in den Logs.
                # Eine robuste Extraktion erfordert das Dekodieren der Transaktionsinstruktion.
                # Für V1.0 verwenden wir eine vereinfachte Suche nach Pubkeys im gesamten Log.
                pass 
        
        # Vereinfachte Suche nach allen Pubkeys im Log
        pubkeys = []
        for log in logs:
            parts = log.replace(":", " ").split()
            for part in parts:
                try:
                    # Ein gültiger Pubkey ist Base58-kodiert und hat 32-44 Zeichen
                    if 32 <= len(part) <= 44 and part.isalnum() and not part.isdigit():
                         # Filtert die Raydium-Programm-ID selbst heraus
                        if str(RAYDIUM_LP_V4) != part:
                            pubkeys.append(part)
                except:
                    continue
        
        # Entferne Duplikate unter Beibehaltung der Reihenfolge
        unique_keys = list(dict.fromkeys(pubkeys))

        # Annahme basierend auf der Transaktionsstruktur von Raydium:
        if len(unique_keys) >= 6:
            # lp_mint, token_a_mint, token_b_mint, token_a_account, token_b_account
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
    """Holt den Saldo und die Dezimalstellen für ein gegebenes Token-Konto."""
    try:
        account_pubkey = Pubkey.from_string(token_account_address)
        
        # Saldo abrufen
        balance_response = await rpc_client.get_token_account_balance(account_pubkey)
        balance = balance_response.value.ui_amount
        decimals = balance_response.value.decimals
        
        return balance, decimals
    except SolanaRpcException as e:
        cerebrum.error(f"RPC-Fehler beim Abrufen der Kontodetails für {token_account_address}: {e}")
    except Exception as e:
        cerebrum.error(f"Allg. Fehler beim Abrufen der Kontodetails für {token_account_address}: {e}")
    return 0, 0


async def _check_liquidity(pool_info: dict):
    """Prüft die tatsächliche anfängliche Liquidität eines neuen Pools."""
    try:
        sol_price = await get_sol_price_usd()
        if not sol_price:
            cerebrum.error("Konnte SOL-Preis nicht abrufen, Liquiditätsprüfung fehlgeschlagen.")
            return False, "$0.00"

        rpc_client = AsyncClient(settings.QUICKNODE_RPC_URL)
        
        balance_a, decimals_a = await _get_token_balance_and_decimals(rpc_client, pool_info["token_a_account"])
        balance_b, decimals_b = await _get_token_balance_and_decimals(rpc_client, pool_info["token_b_account"])
        
        await rpc_client.close()

        total_liquidity_usd = 0
        # Wir gehen davon aus, dass einer der Tokens SOL ist, um den USD-Wert zu berechnen
        if pool_info["token_a_mint"] == SOL_MINT_ADDRESS:
            sol_balance = balance_a
            other_token_balance = balance_b
            total_liquidity_usd = (sol_balance * sol_price) * 2
        elif pool_info["token_b_mint"] == SOL_MINT_ADDRESS:
            sol_balance = balance_b
            other_token_balance = balance_a
            total_liquidity_usd = (sol_balance * sol_price) * 2
        else:
            cerebrum.warning("Kein SOL-Paar, genaue Liquiditätsprüfung in V1.0 nicht möglich.")
            # Wir können hier keine genaue USD-Bewertung vornehmen, geben also True zurück,
            # um den Token nicht fälschlicherweise auszusortieren.
            return True, "N/A (Non-SOL Pair)"

        liquidity_value_str = f"${total_liquidity_usd:,.2f}"
        cerebrum.info(f"Echte Liquidität für LP {pool_info.get('lp_mint')}: {liquidity_value_str}")

        if total_liquidity_usd >= MINIMUM_LIQUIDITY_USD:
            return True, liquidity_value_str
        else:
            return False, liquidity_value_str

    except Exception as e:
        cerebrum.error(f"Kritischer Fehler bei der Liquiditätsprüfung: {e}")
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

    # ... (restliche Platzhalter-Checks bleiben unverändert)
    cerebrum.warning(f"[CHECK 2/5] Honeypot-Check für {token_address} noch nicht implementiert. Angenommen: PASS")
    cerebrum.warning(f"[CHECK 3/5] Steuer-Check für {token_address} noch nicht implementiert. Angenommen: PASS")
    cerebrum.warning(f"[CHECK 4/5] Verifizierungs-Check für {token_address} noch nicht implementiert. Angenommen: PASS")
    cerebrum.warning(f"[CHECK 5/5] Dezentralisierungs-Check für {token_address} noch nicht implementiert. Angenommen: PASS")

    cerebrum.success(f"GATEKEEPER-PRÜFUNG BESTANDEN für Token {token_address}")
    return True

async def listen_for_new_pools():
    subscription_request = {"jsonrpc": "2.0", "id": 1, "method": "logsSubscribe", "params": [{"mentions": [str(RAYDIUM_LP_V4)]}, {"commitment": "finalized"}]}
    while True:
        try:
            async with websockets.connect(settings.QUICKNODE_WSS_URL) as websocket:
                cerebrum.info("WebSocket-Verbindung zu QuickNode hergestellt. Lausche auf neue Pools...")
                await websocket.send(json.dumps(subscription_request))
                await websocket.recv()
                async for message in websocket:
                    data = json.loads(message)
                    if 'params' not in data or 'result' not in data['params']: continue
                    logs = data['params']['result']['value']['logs']
                    if any("initialize2" in log for log in logs):
                        cerebrum.success("Neuer Raydium Liquiditätspool entdeckt!")
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
        except (websockets.ConnectionClosed, websockets.ConnectionClosedError) as e:
            cerebrum.error(f"WebSocket-Verbindung verloren: {e}. Versuche in 10 Sekunden erneut...")
            await asyncio.sleep(10)
        except Exception as e:
            cerebrum.critical(f"Ein kritischer Fehler im Gatekeeper-Service ist aufgetreten: {e}")
            await asyncio.sleep(10)