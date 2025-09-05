"use client";

import { useEffect, useState } from "react";
import { Panel } from "@/components/ui/panel";
import { api, CapitalSchema } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

type Capital = { usd: number; sol: number };

export function CapitalTile() {
  const [data, setData] = useState<Capital | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await api<unknown>("/api/capital");
        const parsed = CapitalSchema.parse(raw);
        if (alive) setData(parsed);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Panel title="Capital">
      {loading && <div className="opacity-60 text-sm">Loading…</div>}
      {!loading && data && (
        <div className="flex items-baseline gap-4">
          <div className="text-2xl font-semibold">{formatCurrency(data.usd)}</div>
          <div className="text-sm opacity-75">{data.sol.toFixed(2)} SOL</div>
        </div>
      )}
    </Panel>
  );
}
