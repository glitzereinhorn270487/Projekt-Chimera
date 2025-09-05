// Simple In-Memory DB (kann später durch Upstash/SQL ersetzt werden)
import { randomUUID } from "crypto";
import type { TradeRow, TradeDetail } from "@/types/trade";

type Store = {
  open: TradeRow[];
  closed: TradeRow[];
  details: Record<string, TradeDetail>;
};

const g = globalThis as any;
if (!g.__FIRE_DB__) {
  g.__FIRE_DB__ = {
    open: [],
    closed: [],
    details: {}
  } as Store;
}
const store: Store = g.__FIRE_DB__;

// ---- API ----
async function getTradesByStatus(status: "open" | "closed"): Promise<TradeRow[]> {
  return status === "open" ? [...store.open] : [...store.closed];
}

async function getTradeById(id: string): Promise<TradeDetail | undefined> {
  return store.details[id];
}

async function addTrade(input: Partial<TradeDetail>): Promise<TradeDetail> {
  const id = input.id ?? randomUUID();
  const row: TradeDetail = {
      id,
      chain: input.chain ?? "Solana",
      category: input.category ?? "Meme",
      narrative: input.narrative ?? "",
      scoreX: input.scoreX ?? 50,
      marketcap: input.marketcap ?? 0,
      volume24h: input.volume24h ?? 0,
      initialInvestment: input.initialInvestment ?? 0,
      pnlAbs: input.pnlAbs ?? 0,
      pnlPct: input.pnlPct ?? 0,
      tax: input.tax ?? 0,
      status: "open",
      // Detailfelder
      pumpDumpProb: input.pumpDumpProb ?? 0.2,
      fomoScore: input.fomoScore ?? 40,
      riskScore: input.riskScore ?? 50,
      holders: input.holders ?? 0,
      tx: input.tx ?? { buys: 0, sells: 0, total: 0 },
      topWallets: input.topWallets ?? [],
      telegramUrl: input.telegramUrl,
      dexScreenerUrl: input.dexScreenerUrl,
      address: undefined,
      entryPrice: 0,
      amount: 0
  };
  store.open.unshift(row);
  store.details[id] = row;
  return row;
}

async function closeTrade(id: string): Promise<void> {
  const idx = store.open.findIndex((t) => t.id === id);
  if (idx >= 0) {
    const row = store.open[idx];
    row.status = "closed";
    store.open.splice(idx, 1);
    store.closed.unshift(row);
    store.details[id] = row as TradeDetail;
  }
}

export const db = {
  getTradesByStatus,
  getTradeById,
  addTrade,
  closeTrade
};

export type { TradeRow, TradeDetail };
