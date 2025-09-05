"use client";

import { useEffect, useState } from "react";
import { Panel } from "@/components/ui/panel";
import { api, PnlSummarySchema } from "@/lib/api";
import { formatCurrency, formatPct, pnlClass } from "@/lib/format";

type Pnl = { pnlAbs: number; pnlPct: number; spark: number[] };

export function PnlTile() {
  const [data, setData] = useState<Pnl | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await api<unknown>("/api/pnl/summary?range=day");
        const parsed = PnlSummarySchema.parse(raw);
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
    <Panel title="PnL (today)">
      {loading && <div className="opacity-60 text-sm">Loading…</div>}
      {!loading && data && (
        <div className="flex items-baseline gap-4">
          <div className={`text-2xl font-semibold ${pnlClass(data.pnlAbs)}`}>
            {formatCurrency(data.pnlAbs)}
          </div>
          <div className={`text-sm ${pnlClass(data.pnlAbs)}`}>
            {formatPct(data.pnlPct)}
          </div>
        </div>
      )}
    </Panel>
  );
}
