import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ?? "2025-01-01";
  const to = searchParams.get("to") ?? "2025-12-31";
  const format = (searchParams.get("format") ?? "txt").toLowerCase();

  const content = [
    `# Firefly Tax Export`,
    `period: ${from} -> ${to}`,
    `generated: ${new Date().toISOString()}`,
    "",
    "id,chain,category,narrative,invest,pnl_abs,pnl_pct,tax",
    "demo-1,Solana,Meme,Sample,500,120,-,0",
  ].join("\n");

  const type = format === "csv" ? "text/csv" : "text/plain";
  return new NextResponse(content, {
    headers: {
      "Content-Type": type + "; charset=utf-8",
      "Content-Disposition": `attachment; filename="firefly-tax-${from}-to-${to}.${format}"`,
    },
  });
}
