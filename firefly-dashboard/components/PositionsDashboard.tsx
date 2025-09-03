"use client";

import { useEffect, useMemo, useState } from "react";
import { Position, ClosedPosition, Chain } from "@/types/position";
import { calcPnl } from "@/lib/pnl";

type PriceMap = Record<string, number | null>;

function dex(chain: Chain, sym: string) {
  if (chain === "solana") return `https://dexscreener.com/solana/${sym.toLowerCase()}`;
  return `https://coinmarketcap.com/currencies/${sym.toLowerCase()}`;
}

const LS_OPEN = "ff_open_positions";
const LS_CLOSED = "ff_closed_positions";

export default function PositionsDashboard() {
  const [open, setOpen] = useState<Position[]>([]);
  const [closed, setClosed] = useState<ClosedPosition[]>([]);
  const [loading, setLoading] = useState(false);

  // Form
  const [sym, setSym] = useState("SOL");
  const [amt, setAmt] = useState<number>(0);
  const [entry, setEntry] = useState<number>(0);
  const [chain, setChain] = useState<Chain>("solana");

  // load/persist
  useEffect(() => {
    const o = JSON.parse(localStorage.getItem(LS_OPEN) || "[]");
    const c = JSON.parse(localStorage.getItem(LS_CLOSED) || "[]");
    if (o.length === 0 && c.length === 0) {
      const seed: Position[] = [
        { id: "p1", token: "SOL", chain: "solana", amount: 100, entryPrice: 150.25, openedAt: Date.now(), link: dex("solana","SOL") },
        { id: "p2", token: "ETH", chain: "ethereum", amount: 10, entryPrice: 3000, openedAt: Date.now(), link: dex("ethereum","ETH") }
      ];
      setOpen(seed);
      setClosed([
        { id: "c1", token: "JUP", chain: "solana", amount: 5000, entryPrice: 1.10, currentPrice: 1.25,
          exitPrice: 1.25, openedAt: Date.now()-86400000, closedAt: Date.now(), link: dex("solana","JUP") },
        { id: "c2", token: "WIF", chain: "solana", amount: 10000, entryPrice: 2.50, currentPrice: 2.00,
          exitPrice: 2.00, openedAt: Date.now()-172800000, closedAt: Date.now(), link: dex("solana","WIF") }
      ]);
    } else {
      setOpen(o); setClosed(c);
    }
  }, []);

  useEffect(() => localStorage.setItem(LS_OPEN, JSON.stringify(open)), [open]);
  useEffect(() => localStorage.setItem(LS_CLOSED, JSON.stringify(closed)), [closed]);

  async function refreshPrices() {
    const symbols = Array.from(new Set(open.map(p => p.token.toUpperCase())));
    if (!symbols.length) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/prices?symbols=${encodeURIComponent(symbols.join(","))}`);
      const map = (await r.json()) as PriceMap;
      setOpen(prev => prev.map(p => ({ ...p, currentPrice: map[p.token.toUpperCase()] ?? p.currentPrice ?? p.entryPrice })));
    } finally { setLoading(false); }
  }

  function addPosition() {
    if (!sym || !amt || !entry) return;
    const p: Position = {
      id: `p_${Date.now()}`,
      token: sym.toUpperCase(),
      chain,
      amount: amt,
      entryPrice: entry,
      openedAt: Date.now(),
      currentPrice: entry,
      link: dex(chain, sym.toUpperCase())
    };
    setOpen(prev => [p, ...prev]);
    setSym(""); setAmt(0); setEntry(0);
    void refreshPrices();
  }

  function closePosition(p: Position) {
    const exit = p.currentPrice ?? p.entryPrice;
    const c: ClosedPosition = { ...p, exitPrice: exit, closedAt: Date.now() };
    setOpen(prev => prev.filter(x => x.id !== p.id));
    setClosed(prev => [c, ...prev]);
  }

  return (
    <main className="p-6 md:p-8 lg:p-10 space-y-6">
      <header className="flex items-center gap-3">
        <span className="text-2xl">🔥</span>
        <h1 className="text-2xl md:text-3xl font-semibold">Firefly Dashboard</h1>
      </header>

      {/* Controls */}
      <section className="bg-black/20 rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold">Add Position</h2>
        <div className="grid md:grid-cols-5 gap-3">
          <input className="bg-transparent border px-3 py-2 rounded-lg" placeholder="Token (SOL)" value={sym} onChange={e=>setSym(e.target.value)} />
          <input className="bg-transparent border px-3 py-2 rounded-lg" placeholder="Amount" type="number" value={amt||""} onChange={e=>setAmt(Number(e.target.value))} />
          <input className="bg-transparent border px-3 py-2 rounded-lg" placeholder="Entry (USD)" type="number" value={entry||""} onChange={e=>setEntry(Number(e.target.value))} />
          <div className="flex gap-2">
            <button className={`border px-3 py-2 rounded-lg ${chain==='solana'?'bg-white/10':''}`} onClick={()=>setChain('solana')}>Solana</button>
            <button className={`border px-3 py-2 rounded-lg ${chain==='ethereum'?'bg-white/10':''}`} onClick={()=>setChain('ethereum')}>Ethereum</button>
          </div>
          <button onClick={addPosition} className="border px-3 py-2 rounded-lg hover:bg-white/10">Add</button>
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        {/* Open */}
        <div className="rounded-2xl p-4 border">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Open Positions</h2>
            <button onClick={refreshPrices} disabled={loading} className="border px-3 py-1 rounded-lg hover:bg-white/10">{loading?'…':'Refresh'}</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>
                <th className="text-left">Token</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Entry</th>
                <th className="text-right">Price</th>
                <th className="text-right">P&L</th>
                <th className="text-right">P&L %</th>
                <th></th>
              </tr></thead>
              <tbody>
              {open.map(p=>{
                const { abs, pct } = calcPnl(p);
                return (
                  <tr key={p.id} className="border-t/10 border-t">
                    <td className="font-semibold">{p.token}</td>
                    <td className="text-right">{p.amount.toLocaleString()}</td>
                    <td className="text-right">${p.entryPrice.toLocaleString()}</td>
                    <td className="text-right">${(p.currentPrice ?? p.entryPrice).toLocaleString()}</td>
                    <td className={`text-right ${abs>=0?'text-green-400':'text-red-400'}`}>${abs.toLocaleString()}</td>
                    <td className={`text-right ${pct>=0?'text-green-400':'text-red-400'}`}>{pct.toFixed(2)}%</td>
                    <td className="text-right">
                      <div className="flex gap-2 justify-end">
                        <a href={p.link} target="_blank" rel="noreferrer" className="underline underline-offset-4">↗</a>
                        <button onClick={()=>closePosition(p)} className="border px-2 py-1 rounded-md hover:bg-white/10">Close</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Closed */}
        <div className="rounded-2xl p-4 border">
          <h2 className="text-lg font-semibold mb-2">Closed Positions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr>
                <th className="text-left">Token</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Entry</th>
                <th className="text-right">Exit</th>
                <th className="text-right">P&L</th>
              </tr></thead>
              <tbody>
              {closed.map(p=>{
                const pnl = (p.exitPrice - p.entryPrice) * p.amount;
                return (
                  <tr key={p.id} className="border-t/10 border-t">
                    <td className="font-semibold">{p.token}</td>
                    <td className="text-right">{p.amount.toLocaleString()}</td>
                    <td className="text-right">${p.entryPrice.toLocaleString()}</td>
                    <td className="text-right">${p.exitPrice.toLocaleString()}</td>
                    <td className={`text-right ${pnl>=0?'text-green-400':'text-red-400'}`}>${pnl.toLocaleString()}</td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
