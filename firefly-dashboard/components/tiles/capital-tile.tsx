// firefly-dashboard/components/tiles/capital-tile.tsx
"use client";
import { Panel } from "@/components/ui/panel";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Capital } from "@/types/trade";

export function CapitalTile() {
  const { data } = useQuery<Capital>({
    queryKey: ["capital"],
    queryFn: () => api<Capital>("/api/capital"),
  });

  return (
    <Panel title="Capital" className="min-h-[140px]">
      <div className="text-3xl md:text-4xl font-semibold t-strong">
        {data ? `$${data.usd.toLocaleString()}` : "—"}
        {data && <span className="ml-2 t-muted text-base align-baseline">{data.sol.toFixed(2)} SOL</span>}
      </div>
    </Panel>
  );
}
