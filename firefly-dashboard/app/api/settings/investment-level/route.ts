import { NextResponse } from "next/server";
let level: "S"|"M"|"L" = "M";
export async function GET(){ return NextResponse.json({ level }); }
export async function POST(req: Request){
  const body = await req.json().catch(()=> ({}));
  level = (body.level ?? "M");
  return NextResponse.json({ ok:true });
}
