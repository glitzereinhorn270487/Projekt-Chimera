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

export async function GET() {
  // Dummy-Daten – identisch zu deinem UI-Beispiel
  const openPositions: Position[] = [
    { token: "SOL", amount: 100, entryPrice: 150.25, currentPrice: 165.5 },
    { token: "ETH", amount: 10,  entryPrice: 3000,   currentPrice: 2950  },
  ];

  const closedPositions: ClosedPosition[] = [
    { token: "JUP", amount: 5000, entryPrice: 1.10, exitPrice: 1.25 },
    { token: "WIF", amount: 10000, entryPrice: 2.50, exitPrice: 2.00 },
  ];

  return Response.json({ openPositions, closedPositions });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
