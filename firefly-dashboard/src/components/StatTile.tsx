"use client";
import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { fmtUsd, fmtPct } from "@/lib/format";

export default function StatTile({
  title, value, sub, spark,
}: { title: string; value: number; sub?: number; spark?: number[] }) {
  const data = (spark ?? []).map((y, i) => ({ i, y }));
  return (
    <div className="glass glow-cyan p-4 rounded-3xl">
      <div className="text-sm text-white/70">{title}</div>
      <div className="text-2xl md:text-3xl font-semibold">{fmtUsd(value)}{typeof sub === "number" && <span className="ml-3 text-sm">{fmtPct(sub)}</span>}</div>
      <div className="h-16 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}><Area type="monotone" dataKey="y" fill="rgba(51,207,255,0.15)" stroke="rgba(51,207,255,0.6)" /></AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
