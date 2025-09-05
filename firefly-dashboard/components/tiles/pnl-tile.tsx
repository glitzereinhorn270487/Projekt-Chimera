"use client";

import * as React from "react";
import useSWR from "swr";
import { Panel } from "@/components/ui/panel";
import { api, PnlSummarySchema } from "@/lib/api";
import { formatCurrency, formatPct } from "@/lib/format";

type Range = "day" | "week" | "month" | "all";

function Sparkline({ data, width = 220, height = 48 }: { data: number[]; width?: number; height?: number }) {
  if (!data?.length) {
    return <div className="h-12 w-[220px] bg-white/5 rounded-md" />;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = data.length > 1 ? width / (data.length - 1) : width;

  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / span) * height;
    return `${x},${y}`;
  });

  // baseline (0) if 0 is inside the range
  const zeroY = (0 - min) / span;
  const baselineY = Number.isFinite(zeroY) ? height - zeroY * height : null;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {baselineY !== null && baselineY >= 0 && baselineY <= height && (
        <line x1="0" y1={baselineY} x2={width} y2={baselineY} stroke="currentColor" className="opacity-20" />
      )}
      <polyline
        fill="none"
        stroke="currentColor"
        className="text-cyan-300"
        strokeWidth="2"
        points={points.join(" ")}
      />
    </svg>
  );
}

export function PnlTile() {
  const [range, setRange] = React.useState<Range>("day");

  const { data, isLoading, error, mutate } = useSWR(
    ["/api/pnl/summary", range],
    ([, r]) => api(`/api/pnl/summary?range=${r}`).then(PnlSummarySchema.parse),
    { refreshInterval: 20_000 }
  );

  const btn = (r: Range, label: string) => (
    <button
      key={r}
      onClick={() => setRange(r)}
      className={`px-2 py-1 rounded-md ring-1 ${
        range === r
          ? "bg-cyan/20 ring-cyan/40"
          : "bg-white/5 hover:bg-white/10 ring-white/10"
      }`}
    >
      {label}
    </button>
  );

  return (
    <Panel
      title="PnL"
      actions={
        <div className="flex gap-2">
          {btn("day", "Day")}
          {btn("week", "Week")}
          {btn("month", "Month")}
          {btn("all", "All")}
          <button
            onClick={() => mutate()}
            className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20"
          >
            Refresh
          </button>
        </div>
      }
    >
      {error && <div className="text-red-300 text-sm">Could not load PnL.</div>}
      <div className="flex items-center justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-wide text-white/60">
            Absolute
          </div>
          <div className="text-3xl font-semibold">
            {isLoading || !data ? "…" : formatCurrency(data.pnlAbs)}
          </div>
          <div className={`text-sm ${!data ? "" : data.pnlPct >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
            {isLoading || !data ? "…" : formatPct(data.pnlPct)}
          </div>
        </div>
        <Sparkline data={data?.spark ?? []} />
      </div>
    </Panel>
  );
}

export default PnlTile;
