"use client";
import { useEffect, useState } from "react";

type Position = { token: string; amount: number; entryPrice: number; currentPrice: number };
type ClosedPosition = { token: string; amount: number; entryPrice: number; exitPrice: number };

export default function PositionsDashboard() {
  const [open, setOpen] = useState<Position[]>([]);
  const [closed, setClosed] = useState<ClosedPosition[]>([]);
  const [refetch, setRefetch] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>({});

  // Auto-Refresh alle 20 Sekunden
  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 20000);
    return () => clearInterval(id);
  }, []);

  async function fetchData() {
    const res1 = await fetch("/api/managePositions");
    const { openPositions, closedPositions } = await res1.json();
    setOpen(openPositions);
    setClosed(closedPositions);

    const res2 = await fetch("/api/prices?symbols=SOL,ETH,JUP,WIF");
    const { prices } = await res2.json();
    setPrices(prices);
  }

  async function fetchPrices(keys: string[], opts?: { chain?: string }) {
    const u = new URL("/api/prices", typeof window === "undefined" ? "http://localhost" : window.location.origin);
    // Du kannst entweder echte Adressen oder Symbolnamen übergeben
    // (die API erkennt beides):
    u.searchParams.set("k", keys.join(","));
    if (opts?.chain) u.searchParams.set("chain", opts.chain);
    const r = await fetch(u.toString(), { cache: "no-store" });
    if (!r.ok) throw new Error("price fetch failed");
    const { prices } = (await r.json()) as { prices: Record<string, number | null> };
    return prices;
  }
  

  async function addPosition() {
    await fetch("/api/managePositions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "SOL", amount: 50, entryPrice: prices.SOL || 160 }),
    });
    fetchData();
  }

  async function closePosition(token: string) {
    await fetch("/api/managePositions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    fetchData();
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold">Open Positions</h2>
      <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={addPosition}>
        ➕ Add Position
      </button>
      <table className="w-full">
        <thead>
          <tr>
            <th>Token</th><th>Amount</th><th>Entry</th><th>Current</th><th>PnL</th><th></th>
          </tr>
        </thead>
        <tbody>
          {open.map((p) => {
            const pnl = (p.currentPrice - p.entryPrice) * p.amount;
            return (
              <tr key={p.token}>
                <td>{p.token}</td>
                <td>{p.amount}</td>
                <td>${p.entryPrice}</td>
                <td>${prices[p.token] ?? p.currentPrice}</td>
                <td className={pnl >= 0 ? "text-green-500" : "text-red-500"}>
                  {pnl.toFixed(2)}
                </td>
                <td>
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded"
                    onClick={() => closePosition(p.token)}
                  >
                    ✖ Close
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold">Closed Positions</h2>
      <ul>
        {closed.map((c) => (
          <li key={c.token}>
            {c.token} – {c.amount} @ ${c.entryPrice} → ${c.exitPrice}
          </li>
        ))}
      </ul>
    </div>
  );
}
