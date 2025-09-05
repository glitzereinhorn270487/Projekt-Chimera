import { NextResponse } from "next/server";
import { getStore } from "../../_db";

export async function GET() {
  const s = await getStore();
  const totalInvest = s.open.reduce((a,b)=>a+b.initialInvestment,0);
  const spark = Array.from({length:20},()=> (Math.random()-0.5)*2).reduce<number[]>((acc,x)=>{ acc.push((acc.at(-1)??0)+x); return acc;},[]);
  const pnlAbs = spark.at(-1)! * 10; // demo
  const pnlPct = totalInvest ? (pnlAbs/Math.max(1,totalInvest))*100 : 0;
  return NextResponse.json({ pnlAbs, pnlPct, spark });
}
