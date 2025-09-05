import { NextRequest, NextResponse } from "next/server";
import { store } from "app/api/_db";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  if (status === "open") return NextResponse.json(store.open, { headers: { "cache-control": "no-store" } });
  if (status === "closed") return NextResponse.json(store.closed, { headers: { "cache-control": "no-store" } });
  return NextResponse.json({ open: store.open, closed: store.closed }, { headers: { "cache-control": "no-store" } });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const row = {
    id: randomUUID(),
    chain: String(body.chain ?? "Solana"),
    symbol: String(body.symbol ?? "SOL").toUpperCase(),
    amount: Number(body.amount ?? 0),
    entryPrice: Number(body.entryPrice ?? 0),
    status: "open" as const,
  };
  store.open.unshift(row);
  return NextResponse.json(row);
}
