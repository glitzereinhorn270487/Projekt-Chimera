import { Position } from "@/types/position";

export function calcPnl(p: Position) {
  const price = p.currentPrice ?? p.entryPrice;
  const abs = (price - p.entryPrice) * p.amount;
  const pct = p.entryPrice === 0 ? 0 : ((price - p.entryPrice) / p.entryPrice) * 100;
  return { abs, pct };
}
