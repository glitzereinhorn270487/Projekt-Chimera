import { NextResponse } from "next/server";
import { addTrade, getStore } from "../_db";

export async function GET() {
  return NextResponse.json(getStore().open);
}

export async function POST(req: Request) {
  const body = await req.json();
  addTrade(body);
  return NextResponse.json({ ok: true });
}
