"use client";

import { useMemo, useState } from "react";
import { Panel } from "@/components/ui/panel";
import { FlipPanel } from "@/components/FlipPanel";
import type { TradeRow } from "@/types/trade";
import { useTrades } from "../../hooks/use-trades";

export function OpenPositionsPanel() {
  const trades = useTrades(); // { open, closed }
  const [selected, setSelected] = useState<TradeRow | null>(null);

  const front = useMemo(() => {
    if (!trades.open.length) {
      return <div className="t-soft">Keine offenen Positionen.</div>;
    }
    return (
      <div className="overflow-x-auto">
        <table className="table-glass">
          <thead>
            <tr>
              <th className="text-left py-2 pr-4">Symbol</th>
              <th className="text-right py-2 pr-4">Amount</th>
              <th className="text-right py-2 pr-4">Entry $</th>
              <th className="text-right py-2 pr-4">PnL $</th>
              <th className="text-right py-2 pr-4">PnL %</th>
              <th className="text-right py-2">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {trades.open.map((r) => (
              <tr key={r.id} className="table-row">
                <td className="py-2 pr-4">{r.symbol ?? r.chain}</td>
                <td className="text-right py-2 pr-4">{r.amount}</td>
                <td className="text-right py-2 pr-4">{r.entryPrice.toFixed(2)}</td>
                <td className="text-right py-2 pr-4">{r.pnlAbs.toFixed(2)}</td>
                <td className="text-right py-2 pr-4">
                  {r.pnlPct.toFixed(2)}
                  %
                </td>
                <td className="text-right py-2">
                  <div className="flex justify-end gap-2">
                    <button className="btn" onClick={() => setSelected(r)}>
                      Details
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={async () => {
                        await fetch(`/api/positions/${r.id}/close`, { method: "POST" });
                        // später: refresh / invalidate
                      }}
                    >
                      Position schließen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [trades.open]);

  const back = selected ? (
    <div className="space-y-4">
      <h4 className="font-semibold">
        Detail: {selected.symbol ?? selected.chain}
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div className="glass-skeleton p-3">
          <div className="t-muted">Narrativ</div>
          <div>{selected.narrative || "—"}</div>
        </div>
        <div className="glass-skeleton p-3">
          <div className="t-muted">ScoreX</div>
          <div>{selected.scoreX}</div>
        </div>
        <div className="glass-skeleton p-3">
          <div className="t-muted">MarketCap</div>
          <div>{selected.marketcap.toLocaleString()}</div>
        </div>
        <div className="glass-skeleton p-3">
          <div className="t-muted">Volumen 24h</div>
          <div>{selected.volume24h.toLocaleString()}</div>
        </div>
        <div className="glass-skeleton p-3">
          <div className="t-muted">Einstieg</div>
          <div>${selected.entryPrice.toFixed(2)}</div>
        </div>
        <div className="glass-skeleton p-3">
          <div className="t-muted">Menge</div>
          <div>{selected.amount}</div>
        </div>
      </div>
    </div>
  ) : (
    <div className="t-soft">Wähle eine Zeile aus.</div>
  );

  return (
    <Panel
      title="Offene Positionen"
      actions={
        <form
          className="hidden md:flex items-center gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget as HTMLFormElement & {
              symbol: HTMLInputElement;
              amount: HTMLInputElement;
              entry: HTMLInputElement;
              chain: HTMLSelectElement;
            };
            const payload = {
              symbol: form.symbol.value || "SOL",
              amount: Number(form.amount.value || 0),
              entry: Number(form.entry.value || 0),
              chain: form.chain.value || "Solana",
            };
            await fetch("/api/positions", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(payload),
            });
            form.reset();
            // später: refresh / invalidation
          }}
        >
          <input name="symbol" placeholder="Symbol" className="input" defaultValue="SOL" />
          <input name="amount" placeholder="Amount" className="input" defaultValue="100" />
          <input name="entry" placeholder="Entry $" className="input" defaultValue="150.25" />
          <select name="chain" className="input">
            <option>Solana</option>
            <option>Ethereum</option>
          </select>
          <button className="btn btn-primary" type="submit">Add Position</button>
        </form>
      }
    >
      <FlipPanel front={front} back={back} />
    </Panel>
  );
}
