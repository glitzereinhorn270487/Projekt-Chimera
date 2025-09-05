import { Redis } from "@upstash/redis";
import { TradeRow, TradeDetail } from "@/types/trade";

const hasUpstash = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = hasUpstash ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! }) : null;

type Store = { open: TradeRow[]; closed: TradeRow[]; details: Record<string, TradeDetail> };
const mem: Store = {
  open: [
    { id:"1", chain:"Solana", category:"Meme", narrative:"WIF momentum", scoreX:72, marketcap:90000000, volume24h:5800000,
      initialInvestment:120, entryPrice:2.0, amount:60, pnlAbs:0, pnlPct:0, tax:0.0, status:"open", symbol:"WIF", address:"So11111111111111111111111111111111111111112"}
  ],
  closed: [],
  details: {}
};

export async function getStore(): Promise<Store> {
  if (!redis) return mem;
  const [open, closed, details] = await Promise.all([
    redis.get<TradeRow[]>("open") ?? [],
    redis.get<TradeRow[]>("closed") ?? [],
    redis.get<Record<string, TradeDetail>>("details") ?? {},
  ]);
  return {
    open: (open as any) ?? [],
    closed: (closed as any) ?? [],
    details: (details as any) ?? {},
  };
}
export async function setStore(s: Store) {
  if (!redis) { Object.assign(mem, s); return; }
  await Promise.all([redis.set("open", s.open), redis.set("closed", s.closed), redis.set("details", s.details)]);
}
