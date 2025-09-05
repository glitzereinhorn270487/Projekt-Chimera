import { NextResponse } from "next/server";
export async function GET(){ 
  // Demo-Kapital, könnte aus Engine/DB kommen
  return NextResponse.json({ usd: 1250.42, sol: 14.22 });
}
