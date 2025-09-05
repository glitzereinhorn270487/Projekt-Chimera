// firefly-dashboard/src/types/trade.ts
export type Chain = "Solana" | "Ethereum" | "BSC" | "Polygon" | string;

export interface TradeRow {
  id: string;
  chain: Chain;
  category: string;          // z.B. "Meme", "DeFi", ...
  narrative: string;         // Story/These
  scoreX: number;            // 0-100
  marketcap: number;         // USD
  volume24h: number;         // USD
  initialInvestment: number; // USD
  entryPrice: number;        // USD pro Token
  amount: number;            // Anzahl Token
  pnlAbs: number;            // USD
  pnlPct: number;            // %
  tax: number;               // USD (oder % – je nach Modell)
  status: "open" | "closed";
  symbol?: string;
  address?: string;
}

export interface TradeDetail extends TradeRow {
  pumpDumpProb: number; // 0-1
  fomoScore: number;    // 0-100
  riskScore: number;    // 0-100
  telegramUrl?: string;
  dexScreenerUrl?: string;
  holders: number;
  tx: { buys: number; sells: number; total: number };
  topWallets: { address: string; concentrationPct: number }[];
}

// Komfort-Alias, falls irgendwo `Trade` erwartet wird:
export type Trade = TradeRow;
