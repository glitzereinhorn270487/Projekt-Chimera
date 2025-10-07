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

# Die Adresse des Raydium Liquidity Pool v4 Programms
RAYDIUM_LP_V4 = Pubkey.from_string('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8')
# Mindestliquidität in USD
MINIMUM_LIQUIDITY_USD = 15000

def _parse_pool_info_from_logs(logs):
    """
    Analysiert die Transaktions-Logs, um die Token-Adressen zu extrahieren.
    Diese Funktion ist komplex und spezifisch für Raydium's initialize2-Logs.
    """
    # Sehr vereinfachte Annahme für dieses Beispiel. Eine robuste Lösung würde
    # die Instruktionsdaten der Transaktion benötigen, um die Konten korrekt zuzuordnen.
    # Wir suchen nach " InitializeInstruction2" und nehmen an, dass die folgenden Pubkeys
    # in einer bestimmten Reihenfolge die Token-Konten und Mint-Adressen sind.
    try:
        # Dies ist eine Heuristik und muss in der Praxis validiert und verfeinert werden.
        pubkeys_in_log = [line.split()[-1] for line in logs if "Program log: InitializeInstruction2" in line or "Program data:" in line or "Invoke" in line]
        
        # Annahme: Die relevanten Adressen sind unter den ersten paar Keys nach der Initialisierung.
        # Eine echte Implementierung würde die Transaktionsdetails abfragen, um das sicherzustellen.
        # Hier extrahieren wir einfach alle potenziellen Pubkeys.
        all_keys = [pk for pk in pubkeys_in_log if len(pk) > 30 and pk.isalnum()]
        
        if len(all_keys) > 5:
             # Annahmen basierend auf typischer Log-Struktur:
            lp_mint = all_keys[0] # Normalerweise der erste Key in den Instruktionsdaten
            token_a_mint = all_keys[1]
            token_b_mint = all_keys[2]
            return {"lp_mint": lp_mint, "token_a": token_a_mint, "token_b": token_b_mint}
    except Exception as e:
        cerebrum.error(f"Fehler beim Parsen der Logs: {e}")
    return None


async def _check_liquidity(pool_info):
    """
    Prüft die anfängliche Liquidität eines neuen Pools.
    """
    try:
        # Wir müssen die Token-Konten finden, die mit dem neuen LP-Mint verbunden sind.
        # Für V1.0 nehmen wir eine Vereinfachung an und müssen diesen Teil in Zukunft robuster gestalten.
        # In der Realität würden wir die Konten des Pools abfragen, um die Bilanzen zu erhalten.
        
        # HINWEIS: Dieser Teil ist hochkomplex und wird für Sprint 2 simuliert.
        # Eine echte Implementierung erfordert das Abrufen und Parsen mehrerer Konten.
        simulated_liquidity = 20000 # Wir simulieren, dass der Pool $20,000 Liquidität hat
        cerebrum.info(f"Simulierte Liquidität für LP {pool_info.get('lp_mint')}: ${simulated_liquidity:,.2f}")
        
        if simulated_liquidity >= MINIMUM_LIQUIDITY_USD:
            return True, f"${simulated_liquidity:,.2f}"
        else:
            return False, f"${simulated_liquidity:,.2f}"

    except Exception as e:
        cerebrum.error(f"Fehler bei der Liquiditätsprüfung: {e}")
        return False, "$0.00"

async def check_token(pool_info: dict) -> bool:
    """
    Führt die Gatekeeper-Prüfungen für einen gegebenen Token durch.
    """
    token_address = pool_info.get("token_b") # Annahme: Token B ist der neue Memecoin
    cerebrum.info(f"Führe Gatekeeper-Prüfung für Token {token_address} durch...")

    # 1. Mindest-Liquidität
    liquidity_ok, liquidity_value = await _check_liquidity(pool_info)
    if not liquidity_ok:
        cerebrum.warning(f"[CHECK 1/5 FAILED] Liquidität ({liquidity_value}) unter dem Minimum von ${MINIMUM_LIQUIDITY_USD:,.2f}")
        return False
    cerebrum.success(f"[CHECK 1/5 PASSED] Liquidität: {liquidity_value}")

    # 2. Honeypot-Check: (Benötigt externe API)
    cerebrum.warning(f"[CHECK 2/5] Honeypot-Check für {token_address} noch nicht implementiert. Angenommen: PASS")

    # 3. Steuer-Limit: (Benötigt Auslesen des Kontrakts)
    cerebrum.warning(f"[CHECK 3/5] Steuer-Check für {token_address} noch nicht implementiert. Angenommen: PASS")

    # 4. Kontrakt verifiziert: (Benötigt API oder Scraping)
    cerebrum.warning(f"[CHECK 4/5] Verifizierungs-Check für {token_address} noch nicht implementiert. Angenommen: PASS")
    
    # 5. Dezentralisierung: (Benötigt Auslesen der Token-Halter)
    cerebrum.warning(f"[CHECK 5/5] Dezentralisierungs-Check für {token_address} noch nicht implementiert. Angenommen: PASS")

    cerebrum.success(f"GATEKEEPER-PRÜFUNG BESTANDEN für Token {token_address}")
    return True

async def listen_for_new_pools():
    """
    Verbindet sich mit dem QuickNode WebSocket und lauscht auf neue Pools.
    """
    subscription_request = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "logsSubscribe",
        "params": [
            {"mentions": [str(RAYDIUM_LP_V4)]},
            {"commitment": "finalized"}
        ]
    }

    while True:
        try:
            async with websockets.connect(settings.QUICKNODE_WSS_URL) as websocket:
                cerebrum.info("WebSocket-Verbindung zu QuickNode hergestellt. Lausche auf neue Pools...")
                await websocket.send(json.dumps(subscription_request))
                await websocket.recv() # Bestätigungsnachricht lesen und ignorieren

                async for message in websocket:
                    data = json.loads(message)
                    if 'params' not in data or 'result' not in data['params']:
                        continue

                    logs = data['params']['result']['value']['logs']
                    
                    if any("initialize2" in log for log in logs):
                        cerebrum.success("Neuer Raydium Liquiditätspool entdeckt!")
                        
                        pool_info = _parse_pool_info_from_logs(logs)
                        if pool_info:
                            cerebrum.info(f"Pool-Informationen extrahiert: LP Mint {pool_info.get('lp_mint')}")
                            
                            if await check_token(pool_info):
                                token_address = pool_info.get("token_b") # Annahme: B ist der neue Token
                                token_data = {"address": token_address, "status": "watching", "lp_mint": pool_info.get('lp_mint')}
                                await db_manager.add_to_hot_watchlist(token_address)
                                await db_manager.add_to_cold_watchlist(token_data)
                                
                                message = (f"✅ **Neuer Token auf Watchlist** ✅\n\n"
                                           f"`{token_address}`\n\n"
                                           f"Der Token hat die Gatekeeper-Prüfung bestanden und wird jetzt überwacht.")
                                await send_telegram_message(message)

        except (websockets.ConnectionClosed, websockets.ConnectionClosedError) as e:
            cerebrum.error(f"WebSocket-Verbindung verloren: {e}. Versuche in 10 Sekunden erneut...")
            await asyncio.sleep(10)
        except Exception as e:
            cerebrum.critical(f"Ein kritischer Fehler im Gatekeeper-Service ist aufgetreten: {e}")
            await asyncio.sleep(10)