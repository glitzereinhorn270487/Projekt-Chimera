import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const range = url.searchParams.get("range") || "day";
  const spark = Array.from({ length: 24 }, (_, i) => Math.sin(i / 3) * 1000 + i * 50);
  const pnlAbs = spark[spark.length - 1] - spark[0];
  const pnlPct = (pnlAbs / Math.max(1, Math.abs(spark[0]))) * 100;
  return NextResponse.json({ pnlAbs, pnlPct, spark });
}
