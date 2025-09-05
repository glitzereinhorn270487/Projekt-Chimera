import type { TradeDetail } from "@/types/trade";

export const seed: TradeDetail[] = [
  {
    id: "demo-1",
    chain: "Solana",
    category: "Meme",
    narrative: "Demo",
    scoreX: 55,
    marketcap: 1_000_000,
    volume24h: 50_000,
    initialInvestment: 500,
    entryPrice: 0.1,
    amount: 1_000,
    pnlAbs: 0,
    pnlPct: 0,
    tax: 0,
    status: "open",
    symbol: "SOL",
    address: "So11111111111111111111111111111111111111112",
    pumpDumpProb: 0.2,
    fomoScore: 40,
    riskScore: 50,
    holders: 0,
    tx: { buys: 0, sells: 0, total: 0 },
    topWallets: []
  }
];
