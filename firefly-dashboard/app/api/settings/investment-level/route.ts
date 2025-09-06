import { NextResponse } from "next/server";

let LEVEL: "S" | "M" | "L" = "M";

export async function GET() {
  return NextResponse.json({ level: LEVEL });
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (body?.level && ["S", "M", "L"].includes(body.level)) LEVEL = body.level;
  return NextResponse.json({ ok: true });
}
