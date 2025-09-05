import { z } from "zod";

/** Fetch-Helper (no-store) mit Text-Fallback für /api/tax/export */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { ...init, cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return (await res.json()) as T;
  }
  // z. B. Steuer-Export liefert text/plain
  return (await res.text()) as unknown as T;
}

/* ===========================
   Zod-Schemas (defensiv)
   =========================== */

export const TradeRowSchema = z.object({
  id: z.string(),
  chain: z.string(),
  category: z.string(),
  narrative: z.string(),
  scoreX: z.number(),
  marketcap: z.number(),
  volume24h: z.number(),
  initialInvestment: z.number(),

  // in Mock/DB teilweise vorhanden – daher optional, damit nichts crasht
  entryPrice: z.number().optional(),
  amount: z.number().optional(),

  pnlAbs: z.number(),
  pnlPct: z.number(),
  tax: z.number(),
  status: z.union([z.literal("open"), z.literal("closed")]),
  symbol: z.string().optional(),
  address: z.string().optional(),
});
export const TradeRowsSchema = z.array(TradeRowSchema);

export const DetailSchema = TradeRowSchema.extend({
  pumpDumpProb: z.number(),
  fomoScore: z.number(),
  riskScore: z.number(),
  telegramUrl: z.string().optional(),
  dexScreenerUrl: z.string().optional(),
  holders: z.number(),
  tx: z.object({ buys: z.number(), sells: z.number(), total: z.number() }),
  topWallets: z.array(
    z.object({ address: z.string(), concentrationPct: z.number() })
  ),
});

export const PnlSummarySchema = z.object({
  pnlAbs: z.number(),
  pnlPct: z.number(),
  spark: z.array(z.number()),
});

export const CapitalSchema = z.object({
  usd: z.number(),
  sol: z.number(),
});

/** Map<symbol, Map<exchange, price|null>>
 *  z.B. { SOL: { binance: 123.4, okx: null } }
 */
export const PricesSchema = z.record(
  z.string(),                              // outer key: symbol
  z.record(z.string(), z.number().nullable()) // inner key: exchange -> price|null
);


/* ===== Optionale abgeleitete Typen ===== */
export type TradeRow = z.infer<typeof TradeRowSchema>;
export type TradeDetail = z.infer<typeof DetailSchema>;
export type PnlSummary = z.infer<typeof PnlSummarySchema>;
export type Capital = z.infer<typeof CapitalSchema>;
export type Prices = z.infer<typeof PricesSchema>;
