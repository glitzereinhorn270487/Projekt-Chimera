// firefly-dashboard/src/types/trade.ts
export type Chain = "Solana" | "Ethereum" | "BSC" | "Polygon" | string;

export interface Trade {
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
