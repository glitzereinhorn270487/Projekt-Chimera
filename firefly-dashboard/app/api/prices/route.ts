import { NextRequest, NextResponse } from "next/server";

// DexScreener docs: /tokens/v1/{chain}/{tokenAddresses} (bis 30 Adressen, liefert priceUsd)
// und Fallback: /latest/dex/search?q=... .
// Quelle: https://docs.dexscreener.com/api/reference  (siehe "Get one or multiple pairs by token address")
const DEX = "https://api.dexscreener.com";

// sehr grobe Base58-Check (32–64 Zeichen, ohne 0OIl)
const isAddress = (s: string) => /^[1-9A-HJ-NP-Za-km-z]{32,64}$/.test(s);

// Mapping für Sonderfälle
const DEFAULT_CHAIN = "solana";
const WSOL = "So11111111111111111111111111111111111111112";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const chain = (url.searchParams.get("chain") || DEFAULT_CHAIN).toLowerCase();

  // kompatibel zu verschiedenen Parametern: ?k=...,?addresses=...,?symbols=...
  const raw =
    url.searchParams.get("k") ||
    url.searchParams.get("addresses") ||
    url.searchParams.get("symbols") ||
    url.searchParams.get("q") ||
    "";

  const keys = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const addresses: string[] = [];
  const symbols: string[] = [];

  for (const k of keys) {
    if (isAddress(k)) {
      addresses.push(k);
    } else if (k.toUpperCase() === "SOL") {
      // SOL als wSOL-Adresse abfragen
      addresses.push(WSOL);
    } else {
      symbols.push(k);
    }
  }

  const prices: Record<string, number | null> = {};

  // 1) Adressen in 30er-Chunks über /tokens/v1/{chain}/{addr,addr,...}
  for (let i = 0; i < addresses.length; i += 30) {
    const chunk = addresses.slice(i, i + 30);
    const endpoint = `${DEX}/tokens/v1/${chain}/${chunk.join(",")}`;
    const r = await fetch(endpoint, { next: { revalidate: 5 } });
    if (!r.ok) continue;
    const data = (await r.json()) as any[];
    // jede Rückgabe ist ein Pair-Objekt mit baseToken / priceUsd
    for (const p of data) {
      const addr = p?.baseToken?.address ?? chunk[0];
      const v = parseFloat(p?.priceUsd ?? "NaN");
      prices[addr] = Number.isFinite(v) ? v : null;
    }
  }

  // 2) Fallback für Symbolnamen: Suche nach "<SYM> USDC" und nimm erstes Match
  //    (/latest/dex/search?q=...) – kann je nach Markt variieren.
  for (const sym of symbols) {
    const endpoint = `${DEX}/latest/dex/search?q=${encodeURIComponent(
      `${sym} USDC`
    )}`;
    try {
      const r = await fetch(endpoint, { next: { revalidate: 5 } });
      if (!r.ok) {
        prices[sym.toUpperCase()] = null;
        continue;
      }
      const data = (await r.json()) as any;
      const pair = data?.pairs?.find(
        (p: any) =>
          p?.baseToken?.symbol?.toUpperCase() === sym.toUpperCase() &&
          p?.priceUsd
      );
      const v = pair ? parseFloat(pair.priceUsd) : NaN;
      prices[sym.toUpperCase()] = Number.isFinite(v) ? v : null;
    } catch {
      prices[sym.toUpperCase()] = null;
    }
  }

  // kurze CDN-Cache-Times: 5s + stale-while-revalidate
  return NextResponse.json(
    { ok: true, prices },
    {
      headers: {
        "cache-control": "public, s-maxage=5, stale-while-revalidate=30",
      },
    }
  );
}
