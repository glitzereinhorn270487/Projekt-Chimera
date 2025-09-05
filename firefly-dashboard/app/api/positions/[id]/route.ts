import { NextResponse } from "next/server";
import { getStore } from "../../_db";
import { TradeDetail } from "@/types/trade";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const store = await getStore();
  const r = [...store.open, ...store.closed].find(x=>x.id===params.id);
  if(!r) return NextResponse.json({ error: "not found" }, { status: 404 });
  const d: TradeDetail = {
    ...r,
    pumpDumpProb: 0.18, fomoScore: 62, riskScore: 38,
    holders: 1234, tx: { buys: 122, sells: 98, total: 220 },
    topWallets: [
      { address: "4Tx...abc", concentrationPct: 2.1 },
      { address: "Ed9...xyz", concentrationPct: 1.8 },
      { address: "So1...qwe", concentrationPct: 1.2 },
    ],
    dexScreenerUrl: r.address ? `https://dexscreener.com/solana/${r.address}` : undefined,
  };
  return NextResponse.json(d);
}
