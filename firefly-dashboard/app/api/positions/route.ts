import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database"; // deine einfache In-Memory/Upstash-DB

export async function GET(req: NextRequest) {
  const status = new URL(req.url).searchParams.get("status") ?? "open";
  const rows = await db.getTradesByStatus(status);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = await db.addTrade(body); // {id,...}
  return NextResponse.json({ ok: true, trade: created });
}
