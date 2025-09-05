// firefly-dashboard/src/types/trade.ts
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
  entryPrice: number;
  amount: number;
  pnlAbs: number;
  pnlPct: number;
  tax: number;
  status: "open" | "closed";
  symbol?: string;
  address?: string;
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

/** Für PnL-Tile */
export interface PnlSummary {
  pnlAbs: number;
  pnlPct: number;   // 0..1 (z.B. 0.1234 = 12.34 %)
  spark: number[];
}

export type Trade = TradeRow;

/** Für Capital-Tile */
export interface Capital {
  usd: number;
  sol: number;
}
