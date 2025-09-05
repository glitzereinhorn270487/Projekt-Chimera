import { NextResponse } from "next/server";
let state = { global:false, topics: { Trades:true, Risk:true, Signals:true, PnL:true, Steuer:true } };
export async function GET(){ return NextResponse.json(state); }
export async function POST(req: Request){
  const b = await req.json().catch(()=> ({}));
  state = { global: !!b.global, topics: { ...state.topics, ...(b.topics??{}) } };
  return NextResponse.json({ ok: true });
}
