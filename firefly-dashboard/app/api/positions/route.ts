import { NextRequest, NextResponse } from "next/server";
import { store } from "app/api/_db";
import { randomUUID } from "crypto";
import type { TradeRow } from "@/types/trade";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const noStore = { headers: { "cache-control": "no-store" } };
  if (status === "open")   return NextResponse.json(store.open,   noStore);
  if (status === "closed") return NextResponse.json(store.closed, noStore);
  return NextResponse.json({ open: store.open, closed: store.closed }, noStore);
}

/** Baut ein vollständiges TradeRow mit sinnvollen Defaults */
function makeTradeRow(input: any): TradeRow {
  const amount = Number(input?.amount ?? 0);
  const entryPrice = Number(input?.entryPrice ?? 0);
  const symbol = String(input?.symbol ?? "SOL").toUpperCase();
  const chain = String(input?.chain ?? "Solana");

  return {
    id: randomUUID(),
    chain,
    category: String(input?.category ?? "Meme"),
    narrative: String(input?.narrative ?? ""),
    scoreX: Number(input?.scoreX ?? 50),
    marketcap: Number(input?.marketcap ?? 0),
    volume24h: Number(input?.volume24h ?? 0),
    initialInvestment: Number(
      input?.initialInvestment ?? amount * entryPrice
    ),
    entryPrice,
    amount,
    pnlAbs: Number(input?.pnlAbs ?? 0),
    pnlPct: Number(input?.pnlPct ?? 0),
    tax: Number(input?.tax ?? 0),
    status: "open",
    symbol,
    address: input?.address,     // optional
    // optionale Felder für „closed“-Datensätze, bleiben hier leer
    closePrice: undefined,
    closedAt: undefined,
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const row = makeTradeRow(body);
  store.open.unshift(row);
  return NextResponse.json(row);
}
