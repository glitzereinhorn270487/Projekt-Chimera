"use client";
import React from "react";
import { TradeDetail } from "@/types/trade";
import { fmtUsd, fmtPct, badge } from "@/lib/format";

export default function TradeDetailView({ d }: { d: TradeDetail }) {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">{d.narrative}</div>
        <div className={`px-3 py-1 rounded-md text-xs ${badge(d.scoreX)}`}>ScoreX {d.scoreX}</div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div>Marketcap: {fmtUsd(d.marketcap)}</div>
          <div>Vol 24h: {fmtUsd(d.volume24h)}</div>
          <div>Halter: {d.holders}</div>
          <div>Tx (B/S/T): {d.tx.buys}/{d.tx.sells}/{d.tx.total}</div>
        </div>
        <div className="space-y-2">
          <div>FOMO: {d.fomoScore}</div>
          <div>Risk: {d.riskScore}</div>
          <div>Dump-Prob: {(d.pumpDumpProb*100).toFixed(1)}%</div>
          <div className="flex gap-3">
            {d.dexScreenerUrl && <a className="underline" href={d.dexScreenerUrl} target="_blank">DexScreener</a>}
            {d.telegramUrl && <a className="underline" href={d.telegramUrl} target="_blank">Telegram</a>}
          </div>
        </div>
      </div>
      <div>
        <div className="text-sm mb-1">Top Wallets</div>
        <div className="grid md:grid-cols-3 gap-2">
          {d.topWallets.slice(0,3).map(w=>(
            <div key={w.address} className="glass p-3 rounded-2xl text-xs">
              <div className="truncate">{w.address}</div>
              <div className="text-white/70">{w.concentrationPct.toFixed(2)}%</div>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-3 border-t border-white/10 text-sm">
        Invest: {fmtUsd(d.initialInvestment)} · PnL: {fmtUsd(d.pnlAbs)} ({fmtPct(d.pnlPct)})
      </div>
    </div>
  );
}
