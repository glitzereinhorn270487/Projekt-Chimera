import { NextResponse } from "next/server";
import { getStore, setEngineRunning } from "../../_db";

export async function GET() {
  return NextResponse.json({ running: getStore().engineRunning });
}

export async function POST(req: Request) {
  const { running } = await req.json().catch(() => ({ running: false }));
  setEngineRunning(!!running);
  return NextResponse.json({ ok: true, running: getStore().engineRunning });
}
