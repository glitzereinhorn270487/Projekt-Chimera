export type Chain = "Solana" | "Ethereum" | "BSC" | "Polygon" | string;

export interface TradeRow {
  id: string;
  chain: Chain;
  category: string;
  narrative: string;
  scoreX: number;
  marketcap: number;
  volume24h: number;
  initialInvestment: number;
  entryPrice: number;      // für Live-PnL
  amount: number;          // Stückzahl/Token
  pnlAbs: number;
  pnlPct: number;
  tax: number;
  status: "open" | "closed";
  symbol?: string;         // z.B. "WIF" / Dexsymbol
  address?: string;        // Token Address (für Live-Preis)
}

export interface TradeDetail extends TradeRow {
  pumpDumpProb: number;
  fomoScore: number;
  riskScore: number;
  telegramUrl?: string;
  dexScreenerUrl?: string;
  holders: number;
  tx: { buys: number; sells: number; total: number };
  topWallets: { address: string; concentrationPct: number }[];
}
