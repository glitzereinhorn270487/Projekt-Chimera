export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function nowISO() {
  return new Date().toISOString();
}

export async function GET() {
  // Dummy: "verarbeite" 2 Einträge aus einer imaginären Queue
  const processed = [
    { symbol: "BONK", action: "create_position" },
    { symbol: "WIF", action: "create_position" },
  ];
  return Response.json({ ok: true, task: "processTokenQueue", processed, at: nowISO() });
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}
