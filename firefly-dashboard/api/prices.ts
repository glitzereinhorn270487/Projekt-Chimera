// Vercel Serverless Function – einfache Preis-Bridge über CoinGecko
import type { VercelRequest, VercelResponse } from '@vercel/node';

const COINGECKO = 'https://api.coingecko.com/api/v3/simple/price';

const mapSymbol = (sym: string) => {
  const m: Record<string, string> = { SOL: 'solana', ETH: 'ethereum', JUP: 'jupiter-exchange-solana', WIF: 'dogwifcoin' };
  return m[sym.toUpperCase()] || sym.toLowerCase();
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const symbols = String(req.query.symbols || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!symbols.length) return res.status(400).json({ error: 'symbols query required, e.g. ?symbols=SOL,ETH' });

    const ids = symbols.map(mapSymbol).join(',');
    const url = `${COINGECKO}?ids=${encodeURIComponent(ids)}&vs_currencies=usd`;
    const r = await fetch(url, { headers: { 'accept': 'application/json' } });
    if (!r.ok) return res.status(r.status).json({ error: `coingecko ${r.status}` });
    const json = await r.json();

    const out: Record<string, number> = {};
    symbols.forEach((s) => {
      const id = mapSymbol(s);
      out[s.toUpperCase()] = json[id]?.usd ?? null;
    });
    res.setHeader('cache-control', 's-maxage=30, stale-while-revalidate=60');
    return res.status(200).json(out);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'unknown error' });
  }
}
