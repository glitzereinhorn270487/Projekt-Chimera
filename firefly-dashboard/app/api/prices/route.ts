export const runtime = "nodejs"; // Vercel Node runtime

const COINGECKO = "https://api.coingecko.com/api/v3/simple/price";
const mapSymbol = (s: string) => {
  const m: Record<string,string> = {
    SOL: "solana",
    ETH: "ethereum",
    JUP: "jupiter-exchange-solana",
    WIF: "dogwifcoin"
  };
  return m[s.toUpperCase()] || s.toLowerCase();
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const list = (searchParams.get("symbols") || "").split(",").map(s=>s.trim()).filter(Boolean);
  if (!list.length) return new Response(JSON.stringify({ error: "symbols required"}), { status: 400 });

  const ids = list.map(mapSymbol).join(",");
  const url = `${COINGECKO}?ids=${encodeURIComponent(ids)}&vs_currencies=usd`;
  const r = await fetch(url, { headers: { accept: "application/json" } });
  if (!r.ok) return new Response(JSON.stringify({ error: `coingecko ${r.status}` }), { status: r.status });
  const json = await r.json();

  const out: Record<string, number|null> = {};
  list.forEach(s => { out[s.toUpperCase()] = json[mapSymbol(s)]?.usd ?? null; });

  return new Response(JSON.stringify(out), {
    status: 200,
    headers: { "content-type": "application/json", "cache-control": "s-maxage=30, stale-while-revalidate=60" }
  });
}
