// firefly-dashboard/components/tiles/pnl-tile.tsx
"use client";
import { Panel } from "@/components/ui/panel";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { PnlSummary } from "@/types/trade";

export function PnlTile() {
  const { data } = useQuery<PnlSummary>({
    queryKey: ["pnl", "today"],
    queryFn: () => api<PnlSummary>("/api/pnl/summary?range=day"),
  });

  return (
    <Panel title="PnL (today)" className="min-h-[140px]">
      <div className="text-3xl md:text-4xl font-semibold text-emerald-300">
        {data ? `$${data.pnlAbs.toLocaleString()}` : "—"}
        {data && (
          <span className="ml-2 text-emerald-400/80 text-base align-baseline">
            +{(data.pnlPct * 100).toFixed(2)}%
          </span>
        )}
      </div>
    </Panel>
  );
}
