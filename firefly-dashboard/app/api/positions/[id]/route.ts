import { NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const detail = await db.getTradeById(params.id);
  if (!detail) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(detail);
}
