import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";

type Range = "day" | "week" | "month" | "all";

export async function GET(req: NextRequest) {
  const range = (new URL(req.url).searchParams.get("range") ?? "day") as Range;

  const [open, closed] = await Promise.all([
    db.getTradesByStatus("open"),
    db.getTradesByStatus("closed"),
  ]);
  const all = [...open, ...closed];

  // defensiv & typisiert:
  const pnlAbs = all.reduce((acc: number, t) => acc + (t.pnlAbs ?? 0), 0);
  const invested = all.reduce((acc: number, t) => acc + (t.initialInvestment ?? 0), 0);
  const pnlPct = invested > 0 ? (pnlAbs / invested) * 100 : 0;

  // simple Sparkline (12 Punkte) – später durch echte History ersetzen
  const spark = all.slice(0, 12).map((t) => {
    const v = Number.isFinite(t.pnlPct) ? t.pnlPct : 0;
    return Math.max(-100, Math.min(100, v));
  });

  return NextResponse.json({ pnlAbs, pnlPct, spark, range });
}
