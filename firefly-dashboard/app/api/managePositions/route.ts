export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Position = {
  token: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
};

type ClosedPosition = {
  token: string;
  amount: number;
  entryPrice: number;
  exitPrice: number;
};

let openPositions: Position[] = [
  { token: "SOL", amount: 100, entryPrice: 150.25, currentPrice: 165.5 },
  { token: "ETH", amount: 10, entryPrice: 3000, currentPrice: 2950 },
];

let closedPositions: ClosedPosition[] = [
  { token: "JUP", amount: 5000, entryPrice: 1.1, exitPrice: 1.25 },
  { token: "WIF", amount: 10000, entryPrice: 2.5, exitPrice: 2.0 },
];

export async function GET() {
  return Response.json({ openPositions, closedPositions });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { token, amount, entryPrice } = body;

  if (!token || !amount || !entryPrice) {
    return new Response("Missing fields", { status: 400 });
  }

  openPositions.push({ token, amount, entryPrice, currentPrice: entryPrice });
  return Response.json({ ok: true, openPositions });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { token } = body;

  const idx = openPositions.findIndex((p) => p.token === token);
  if (idx === -1) return new Response("Not found", { status: 404 });

  const [pos] = openPositions.splice(idx, 1);
  closedPositions.push({
    token: pos.token,
    amount: pos.amount,
    entryPrice: pos.entryPrice,
    exitPrice: pos.currentPrice,
  });

  return Response.json({ ok: true, closedPositions });
}
