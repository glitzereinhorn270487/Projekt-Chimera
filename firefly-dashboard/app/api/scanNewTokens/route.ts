export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function nowISO() {
  return new Date().toISOString();
}

export async function GET() {
  // Dummy-Ergebnis: so tun als ob 2 neue Tokens gefunden wurden
  const found = [
    { symbol: "BONK", chain: "solana" },
    { symbol: "WIF", chain: "solana" },
  ];
  return Response.json({ ok: true, task: "scanNewTokens", found, at: nowISO() });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
