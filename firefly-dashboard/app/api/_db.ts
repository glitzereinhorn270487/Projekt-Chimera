// firefly-dashboard/app/api/_db.ts
import type { TradeRow, TradeDetail } from "@/types/trade";

// Beispiel-In-Memory-Store
const store = {
  positions: new Map<string, TradeRow>(),
  details: new Map<string, TradeDetail>(),
};

export function getStore() {
  return store;
}

// Beispiel-Seeds (achte auf gültige Felder; entryPrice/amount sind in TradeRow enthalten)
store.positions.set("demo-1", {
  id: "demo-1",
  chain: "Solana",
  category: "Meme",
  narrative: "Funny cat coin",
  scoreX: 72,
  marketcap: 1_200_000,
  volume24h: 340_000,
  initialInvestment: 500,
  entryPrice: 0.00012,
  amount: 4_200_000,
  pnlAbs: 130,
  pnlPct: 26,
  tax: 0,
  status: "open",
  symbol: "CAT",
  address: "So1aNaCa7Coin...",
});
store.details.set("demo-1", {
  ...store.positions.get("demo-1")!,
  pumpDumpProb: 0.18,
  fomoScore: 55,
  riskScore: 40,
  telegramUrl: "https://t.me/something",
  dexScreenerUrl: "https://dexscreener.com/solana/...",
  holders: 2345,
  tx: { buys: 432, sells: 398, total: 830 },
  topWallets: [
    { address: "So1aNaTopW1...", concentrationPct: 6.2 },
    { address: "So1aNaTopW2...", concentrationPct: 4.1 },
    { address: "So1aNaTopW3...", concentrationPct: 3.0 },
  ],
});
