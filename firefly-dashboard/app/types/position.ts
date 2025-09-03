export type Chain = "solana" | "ethereum";

export interface Position {
  id: string;
  token: string;
  chain: Chain;
  amount: number;
  entryPrice: number;
  currentPrice?: number;
  link?: string;
  openedAt: number;
}

export interface ClosedPosition extends Position {
  exitPrice: number;
  closedAt: number;
}
