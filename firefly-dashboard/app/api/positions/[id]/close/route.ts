import { NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  await db.closeTrade(params.id);
  return NextResponse.json({ ok: true });
}
