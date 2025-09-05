"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Panel } from "@/components/ui/panel";

/** Minimales TradeRow-Modell – kompatibel zu deinem Store */
type TradeRow = {
  id: string;
  chain: string;
  symbol: string;
  amount: number;
  entryPrice: number;
  status: "open" | "closed";
};

type Prices = Record<string, { usd: number }>;

export function OpenPositionsPanel() {
  const qc = useQueryClient();

  // Positionen (nur open)
  const positionsQ = useQuery({
    queryKey: ["positions", "open"],
    queryFn: async (): Promise<TradeRow[]> => {
      const res = await fetch("/api/positions?status=open", { cache: "no-store" });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      return Array.isArray(data) ? data : data?.open ?? [];
    },
  });

  // Live-Preise
  const pricesQ = useQuery({
    queryKey: ["prices"],
    queryFn: async (): Promise<Prices> => {
      const res = await fetch("/api/prices", { cache: "no-store" });
      if (!res.ok) throw new Error(res.statusText);
      return (await res.json()) as Prices;
    },
    refetchInterval: 10_000, // alle 10s
  });

  // Add Position (optimistisch)
  const addMut = useMutation({
    mutationFn: async (body: { symbol: string; amount: number; entryPrice: number; chain: string }) => {
      const res = await fetch("/api/positions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onMutate: async (v) => {
      await qc.cancelQueries({ queryKey: ["positions", "open"] });
      const prev = qc.getQueryData<TradeRow[]>(["positions", "open"]) || [];
      const optimistic: TradeRow = {
        id: `tmp_${Date.now()}`,
        chain: v.chain,
        symbol: v.symbol.toUpperCase(),
        amount: v.amount,
        entryPrice: v.entryPrice,
        status: "open",
      };
      qc.setQueryData(["positions", "open"], [optimistic, ...prev]);
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["positions", "open"], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["positions"] }),
  });

  // Close Position (optimistisch)
  const closeMut = useMutation({
    mutationFn: async (payload: { id: string; price: number }) => {
      const res = await fetch(`/api/positions/${payload.id}/close`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ price: payload.price }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: ["positions"] });
      const prev = qc.getQueryData<TradeRow[]>(["positions", "open"]) || [];
      qc.setQueryData(
        ["positions", "open"],
        prev.filter((r) => r.id !== id)
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["positions", "open"], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["positions"] }),
  });

  // Formular-Localstate
  const [symbol, setSymbol] = useState("SOL");
  const [amount, setAmount] = useState<number>(100);
  const [entryPrice, setEntryPrice] = useState<number>(150.25);
  const [chain, setChain] = useState("Solana");

  const rows = positionsQ.data ?? [];
  const prices = pricesQ.data ?? {};

  const rowsWithLive = useMemo(() => {
    return rows.map((r) => {
      const live = prices[r.symbol?.toUpperCase()]?.usd ?? null;
      const pnlAbs = live != null ? (live - r.entryPrice) * r.amount : null;
      const pnlPct =
        live != null && r.entryPrice
          ? ((live / r.entryPrice) - 1) * 100
          : null;
      return { ...r, live, pnlAbs, pnlPct };
    });
  }, [rows, prices]);

  return (
    <Panel title="Offene Positionen" actions={
      <button
        className="btn btn-primary"
        onClick={() =>
          addMut.mutate({ symbol, amount, entryPrice, chain })
        }
        disabled={addMut.isPending}
      >
        Add Position
      </button>
    }>
      {/* Formular */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <label className="t-soft text-sm">
          Symbol
          <input
            className="mt-1 w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="SOL"
          />
        </label>
        <label className="t-soft text-sm">
          Amount
          <input
            type="number"
            className="mt-1 w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={0}
            step="any"
          />
        </label>
        <label className="t-soft text-sm">
          Entry $
          <input
            type="number"
            className="mt-1 w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2"
            value={entryPrice}
            onChange={(e) => setEntryPrice(Number(e.target.value))}
            min={0}
            step="any"
          />
        </label>
        <label className="t-soft text-sm">
          Chain
          <input
            className="mt-1 w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2"
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            placeholder="Solana"
          />
        </label>
      </div>

      {/* Tabelle */}
      {rowsWithLive.length === 0 ? (
        <div className="t-soft">Keine offenen Positionen.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-glass">
            <thead>
              <tr>
                <th>Chain</th>
                <th>Symbol</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Entry $</th>
                <th className="text-right">Live $</th>
                <th className="text-right">PnL $</th>
                <th className="text-right">PnL %</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rowsWithLive.map((r) => (
                <tr key={r.id} className="table-row">
                  <td className="t-soft">{r.chain}</td>
                  <td className="t-strong">{r.symbol}</td>
                  <td className="t-soft text-right">{fmt(r.amount)}</td>
                  <td className="t-soft text-right">{money(r.entryPrice)}</td>
                  <td className="t-soft text-right">
                    {r.live == null ? "—" : money(r.live)}
                  </td>
                  <td className={`text-right ${pnlClass(r.pnlAbs ?? 0)}`}>
                    {r.pnlAbs == null ? "—" : money(r.pnlAbs)}
                  </td>
                  <td className={`text-right ${pnlClass(r.pnlPct ?? 0)}`}>
                    {r.pnlPct == null ? "—" : pct(r.pnlPct)}
                  </td>
                  <td className="text-right">
                    <button
                      className="btn hover:ring-white/30"
                      onClick={() => {
                        const price = r.live ?? r.entryPrice;
                        if (!price) return;
                        // kleiner Confirm, später Dialog
                        if (confirm(`Position ${r.symbol} schließen?`)) {
                          closeMut.mutate({ id: r.id, price });
                        }
                      }}
                      disabled={closeMut.isPending}
                    >
                      Close
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

/* ===== Helper ===== */
const money = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const fmt = (n: number) =>
  n.toLocaleString(undefined, { maximumFractionDigits: 6 });

const pct = (n: number) =>
  `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

const pnlClass = (n: number) =>
  n > 0 ? "text-emerald-400" : n < 0 ? "text-rose-400" : "t-soft";
