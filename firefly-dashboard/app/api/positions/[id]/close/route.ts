import { NextResponse } from "next/server";
import { store } from "app/api/_db";

/** Body: { price: number } – der aktuelle Live-Preis, den wir im Client schon haben */
export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const body = await _req.json().catch(() => ({}));
  const price = typeof body?.price === "number" ? body.price : null;

  const idx = store.open.findIndex((r) => r.id === id);
  if (idx === -1) return NextResponse.json({ ok: false }, { status: 404 });

  const row = store.open[idx];
  const live = price ?? row.entryPrice; // Fallback
  const pnlAbs = (live - row.entryPrice) * row.amount;
  const pnlPct = row.entryPrice ? (live / row.entryPrice - 1) * 100 : 0;

  store.open.splice(idx, 1);
  store.closed.unshift({
    ...row,
    status: "closed",
    closePrice: live,
    pnlAbs,
    pnlPct,
    closedAt: new Date().toISOString(),
  } as any);

  return NextResponse.json({ ok: true });
}
