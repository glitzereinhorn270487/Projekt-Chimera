import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await db.closeTrade(params.id);
  return NextResponse.json({ ok: true });
}
