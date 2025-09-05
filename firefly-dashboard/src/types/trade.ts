export type Chain = "Solana" | "Ethereum" | "BSC" | "Polygon" | string;

export interface TradeRow {
  id: string;
  chain: Chain;
  category: string;
  narrative: string;
  scoreX: number;
  marketcap: number;
  volume24h: number;

  // ergänzt, damit Seeds & Tabellen zusammenpassen
  initialInvestment: number;
  entryPrice: number;       // ✅ neu
  amount: number;           // ✅ neu

  pnlAbs: number;
  pnlPct: number;
  tax: number;
  status: "open" | "closed";

  // optional: für Preis-Lookup
  symbol?: string;
  address?: string;
}

export interface TradeDetail extends TradeRow {
  pumpDumpProb: number;   // 0..1
  fomoScore: number;      // 0..100
  riskScore: number;      // 0..100
  telegramUrl?: string;
  dexScreenerUrl?: string;
  holders: number;
  tx: { buys: number; sells: number; total: number };
  topWallets: { address: string; concentrationPct: number }[];
}
