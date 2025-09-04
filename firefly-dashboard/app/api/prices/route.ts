export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COINGECKO = "https://api.coingecko.com/api/v3/simple/price";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get("symbols")?.split(",") ?? ["solana", "ethereum"];

  // Map: UI-Token → Coingecko-IDs
  const mapping: Record<string, string> = {
    SOL: "solana",
    ETH: "ethereum",
    JUP: "jupiter-exchange-solana",
    WIF: "dogwifcoin"
  };

  const ids = symbols
    .map((s) => mapping[s.toUpperCase()] || mapping[s])
    .filter(Boolean)
    .join(",");

  const res = await fetch(`${COINGECKO}?ids=${ids}&vs_currencies=usd`);
  const data = await res.json();

  // Antwort im UI-Format
  const prices: Record<string, number> = {};
  for (const [token, id] of Object.entries(mapping)) {
    if (data[id]) prices[token] = data[id].usd;
  }

  return Response.json({ prices, at: new Date().toISOString() });
}
