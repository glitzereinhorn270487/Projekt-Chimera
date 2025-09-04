"use client";

import { useState, useEffect } from "react";

type Position = {
  token: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
};

type ClosedPosition = {
  token: string;
  amount: number;
  entryPrice: number;
  exitPrice: number;
};

function calcPnl(entry: number, current: number, amount: number) {
  const pnl = (current - entry) * amount;
  const pnlPct = ((current - entry) / entry) * 100;
  return { pnl, pnlPct };
}

export default function PositionsDashboard() {
  const [openPositions, setOpenPositions] = useState<Position[]>([]);
  const [closedPositions, setClosedPositions] = useState<ClosedPosition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/managePositions");
        const data = await res.json();
        setOpenPositions(data.openPositions || []);
        setClosedPositions(data.closedPositions || []);
      } catch (err) {
        console.error("❌ Fehler beim Laden:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Lade Daten...</p>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Open Positions */}
      <div className="bg-[#1a1a1a] rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Open Positions</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left opacity-70">
              <th>Token</th>
              <th>Amount</th>
              <th>Entry</th>
              <th>Current</th>
              <th>P&amp;L</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {openPositions.map((p, i) => {
              const { pnl, pnlPct } = calcPnl(
                p.entryPrice,
                p.currentPrice,
                p.amount
              );
              return (
                <tr key={i} className="border-t border-gray-700">
                  <td className="py-2">{p.token}</td>
                  <td>{p.amount}</td>
                  <td>${p.entryPrice.toFixed(2)}</td>
                  <td>${p.currentPrice.toFixed(2)}</td>
                  <td className={pnl >= 0 ? "text-green-400" : "text-red-400"}>
                    {pnl >= 0 ? "+" : ""}
                    ${pnl.toFixed(2)}
                  </td>
                  <td className={pnlPct >= 0 ? "text-green-400" : "text-red-400"}>
                    {pnlPct.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Closed Positions */}
      <div className="bg-[#1a1a1a] rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Closed Positions</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left opacity-70">
              <th>Token</th>
              <th>Amount</th>
              <th>Entry</th>
              <th>Exit</th>
              <th>P&amp;L</th>
            </tr>
          </thead>
          <tbody>
            {closedPositions.map((p, i) => {
              const { pnl } = calcPnl(p.entryPrice, p.exitPrice, p.amount);
              return (
                <tr key={i} className="border-t border-gray-700">
                  <td className="py-2">{p.token}</td>
                  <td>{p.amount}</td>
                  <td>${p.entryPrice.toFixed(2)}</td>
                  <td>${p.exitPrice.toFixed(2)}</td>
                  <td className={pnl >= 0 ? "text-green-400" : "text-red-400"}>
                    {pnl >= 0 ? "+" : ""}
                    ${pnl.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
