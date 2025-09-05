import { NextResponse } from "next/server";
export async function GET(req: Request){
  const u = new URL(req.url);
  const from = u.searchParams.get("from") ?? "2025-01-01";
  const to = u.searchParams.get("to") ?? "2025-12-31";
  const txt = `FIREGLY TAX EXPORT
From: ${from}
To:   ${to}

#id, date, pair, side, qty, price, fee, pnl
1001, 2025-05-02, WIF/USDC, BUY, 60, 2.00, 0.03, 0.00
1002, 2025-05-02, WIF/USDC, SELL, 60, 2.12, 0.03, 7.20
-- END --
`;
  return new NextResponse(txt, { headers: { "content-type": "text/plain; charset=utf-8" }});
}
