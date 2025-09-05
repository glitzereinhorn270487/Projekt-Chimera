"use client";
import React, { useMemo, useState } from "react";
import OnOffButton from "./OnOffButton";
import SettingsMenu from "../../components/SettingsMenu";
import StatTile from "./StatTile";
import { Panel } from "./Panel";
import { PositionsTable } from "@/components/PositionsTable/PositionsTable";
import AmpelPanel from "./AmpelPanel";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, PnlSummarySchema, CapitalSchema, TradeRowSchema } from "@/lib/api";
import { toast } from "sonner";

export default function DashboardPage() {
  const qc = useQueryClient();
  const { data: capital } = useQuery({
    queryKey: ["capital"],
    queryFn: async () => CapitalSchema.parse(await api<unknown>("/api/capital")),
    refetchInterval: 7000,
  });

  const { data: pnl } = useQuery({
    queryKey: ["pnl","summary","day"],
    queryFn: async () => PnlSummarySchema.parse(await api<unknown>("/api/pnl/summary?range=day")),
    refetchInterval: 7000,
  });

  // Add Position
  const [showAdd, setShowAdd] = useState(false);
  const [addr, setAddr] = useState("");
  const [invest, setInvest] = useState(50);
  const addMutation = useMutation({
    mutationFn: async () => {
      const r = await api<{ ok: boolean, row: unknown }>("/api/positions",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body: JSON.stringify({ address: addr, initialInvestment: invest })
      });
      // validate row for optimism
      TradeRowSchema.parse((r as any).row);
    },
    onSuccess: ()=>{
      toast.success("Position hinzugefügt");
      qc.invalidateQueries({ queryKey: ["positions","open"] });
      setShowAdd(false); setAddr("");
    },
    onError: (e:any)=> toast.error(e.message || "Fehler beim Hinzufügen")
  });

  const ampScore = useMemo(()=> (pnl?.pnlPct ?? 0) + 50 /* kleine Spielerei */, [pnl]);

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="glass p-4 rounded-3xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <OnOffButton />
          <div className="px-3 py-1 rounded-full bg-cyan/10 ring-1 ring-cyan/30">Investment: M</div>
        </div>
        <div className="w-[320px]"><SettingsMenu /></div>
      </div>

      {/* Top Tiles */}
      <div className="grid md:grid-cols-2 gap-4">
        <StatTile title="Gesamtkapital (USD)" value={capital?.usd ?? 0} />
        <StatTile title="Gesamtkapital (SOL)" value={capital?.sol ?? 0} />
        <StatTile title="PnL (heute)" value={pnl?.pnlAbs ?? 0} sub={pnl?.pnlPct ?? 0} spark={pnl?.spark} />
        <div className="glass p-4 rounded-3xl">
          <div className="text-sm text-white/70 mb-2">Ampel</div>
          <AmpelPanel score={ampScore} />
        </div>
      </div>

      {/* Main Panels */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel
          title="Offene Positionen"
          actions={
            <button onClick={()=>setShowAdd(v=>!v)}
              className="px-3 py-1 rounded-md bg-cyan/20 ring-1 ring-cyan/30">Add Position</button>
          }>
          {showAdd && (
            <div className="mb-4 flex flex-wrap items-end gap-3">
              <div>
                <div className="text-xs opacity-70">Token Address / Symbol</div>
                <input value={addr} onChange={e=>setAddr(e.target.value)} placeholder="So111... oder WIF"
                       className="bg-white/5 border border-white/10 rounded-md px-3 py-2 w-[280px]" />
              </div>
              <div>
                <div className="text-xs opacity-70">Investment (USD)</div>
                <input type="number" value={invest} onChange={e=>setInvest(+e.target.value)}
                       className="bg-white/5 border border-white/10 rounded-md px-3 py-2 w-[160px]" />
              </div>
              <button onClick={()=>addMutation.mutate()}
                className="px-3 py-2 rounded-md bg-cyan/20 ring-1 ring-cyan/30">Hinzufügen</button>
            </div>
          )}
          <PositionsTable status="open" />
        </Panel>

        <Panel title="Geschlossene Positionen">
          <PositionsTable status="closed" />
        </Panel>
      </div>

      {/* Bottom Panels */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Steuer-Export" actions={
          <a href={`/api/tax/export?from=2025-01-01&to=2025-12-31&format=txt`} className="px-3 py-1 rounded-md bg-cyan/20 ring-1 ring-cyan/30">Export als TXT</a>
        }>
          <div className="text-sm text-white/70">Zeitraum per Query-Parameter steuerbar (from/to/format).</div>
        </Panel>
        <Panel title="PnL (Woche)">
          {/* optional: weitere PnL-Sparklines */}
          <div className="text-sm opacity-70">Coming next: Umschalt Tag/Woche/Monat</div>
        </Panel>
      </div>
    </main>
  );
}
