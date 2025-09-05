import { NextResponse } from "next/server";

/** Sehr simpler Stub. Ersetze das später durch echte Kurse (RPC, DEX, CoinGecko etc.). */
export async function GET() {
  // Beispielpreise in USD
  const data: Record<string, { usd: number }> = {
    SOL: { usd: 150.25 },
    ETH: { usd: 3200.5 },
    BTC: { usd: 62000 },
  };
  return NextResponse.json(data, { headers: { "cache-control": "no-store" } });
}
