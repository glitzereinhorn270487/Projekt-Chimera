"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Panel } from "@/components/ui/panel";
import { FlipPanel } from "@/components/FlipPanel";
import type { TradeRow } from "@/types/trade";
import { useTrades } from "../../hooks/use-trades";
import { formatCurrency, formatPct } from "@/lib/format";

export function OpenPositionsPanel() {
  const router = useRouter();
  const { open } = useTrades(); // <-- refetch entfernt
  const [selected, setSelected] = useState<TradeRow | null>(null);

  const table = (
    <div className="p-4">
      {open.length === 0 ? (
        <p className="t-soft">Keine offenen Positionen.</p>
      ) : (
        <table className="table-glass">
          <thead>
            <tr className="t-soft">
              <th className="text-left py-2">Chain</th>
              <th className="text-left py-2">Symbol</th>
              <th className="text-right py-2">Entry $</th>
              <th className="text-right py-2">Amount</th>
              <th className="text-right py-2">PnL $</th>
              <th className="text-right py-2">PnL %</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {open.map((r) => (
              <tr
                key={r.id}
                className="table-row cursor-pointer"
                onClick={() => setSelected(r)}
              >
                <td className="py-2">{r.chain}</td>
                <td className="py-2">{r.symbol ?? "—"}</td>
                <td className="py-2 text-right">{formatCurrency(r.entryPrice)}</td>
                <td className="py-2 text-right">{r.amount}</td>
                <td className="py-2 text-right">{formatCurrency(r.pnlAbs)}</td>
                <td className="py-2 text-right">{formatPct(r.pnlPct)}</td>
                <td className="py-2 text-right">
                  <button
                    className="btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(r);
                    }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const detail = (
    <div className="p-6 space-y-3">
      {!selected ? (
        <p className="t-soft">Bitte eine Position wählen.</p>
      ) : (
        <>
          <h4 className="t-strong text-lg">
            {selected.symbol ?? "Asset"} · {selected.chain}
          </h4>

          <div className="grid grid-cols-2 gap-3 t-soft">
            <Info label="Entry $" value={formatCurrency(selected.entryPrice)} />
            <Info label="Amount" value={String(selected.amount)} />
            <Info label="Marktkap." value={formatCurrency(selected.marketcap)} />
            <Info label="Vol. 24h" value={formatCurrency(selected.volume24h)} />
            <Info label="PnL $" value={formatCurrency(selected.pnlAbs)} />
            <Info label="PnL %" value={formatPct(selected.pnlPct)} />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              className="btn ring-red-400/40 bg-red-400/10 hover:bg-red-400/20 text-red-200"
              onClick={async () => {
                await fetch(`/api/positions/${selected.id}/close`, { method: "POST" });
                setSelected(null);
                router.refresh(); // <-- Seite neu validieren statt refetch
              }}
            >
              Position schließen
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Panel title="Offene Positionen">
      <FlipPanel front={table} back={detail} />
    </Panel>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass p-3 rounded-2xl">
      <div className="t-muted text-xs">{label}</div>
      <div className="t-strong">{value}</div>
    </div>
  );
}
