"use client";

import { Panel } from "@/components/ui/panel";
import { CapitalTile } from "../../components/tiles/capital-tile";
import { PnlTile } from "../../components/tiles/pnl-tile";
import OnOffButton from "../../components/OnOffButton";
import { OpenPositionsPanel } from "../../components/trades/open-positions-panel";
import { ClosedPositionsPanel } from "../../components/trades/closed-positions-panel";
import { TaxExportPanel } from "components/tax/TaxExportPanel";
import AmpelPanel from "@/components/AmpelPanel";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Topbar */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl t-strong tracking-wide">Firefly</h1>
        <a href="#settings" className="btn btn-primary">Einstellungen</a>
      </div>

      {/* Top-Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Agent links oben */}
        <div className="col-span-12 md:col-span-4">
          <Panel title="Agent" actions={<StatusPill stopped />}>
            <p className="t-soft mb-4">
              Steuert die Trading-Engine (derzeit Stub – Backend kann später verdrahtet werden).
            </p>

            <div className="flex gap-3">
              <OnOffButton />
            </div>
          </Panel>
        </div>

        {/* Kapital */}
        <div className="col-span-12 md:col-span-4">
          <CapitalTile />
        </div>

        {/* PnL heute */}
        <div className="col-span-12 md:col-span-4">
          <PnlTile />
        </div>

        {/* Offene */}
        <div className="col-span-12 lg:col-span-6">
          <OpenPositionsPanel />
        </div>

        {/* Geschlossene */}
        <div className="col-span-12 lg:col-span-6">
          <ClosedPositionsPanel />
        </div>

        {/* Ampel links unten */}
        <div className="col-span-12 lg:col-span-4">
          <AmpelPanel score={0} />
        </div>

        {/* Steuer-Export rechts unten (nimmt 8 Spalten) */}
        <div className="col-span-12 lg:col-span-8">
          <TaxExportPanel />
        </div>
      </div>
    </div>
  );
}

function StatusPill({ stopped }: { stopped?: boolean }) {
  return (
    <span
      className={
        "text-xs px-2 py-1 rounded-md ring-1 " +
        (stopped
          ? "text-red-300 ring-red-400/30 bg-red-400/10"
          : "text-emerald-300 ring-emerald-400/30 bg-emerald-400/10")
      }
    >
      {stopped ? "Gestoppt" : "Aktiv"}
    </span>
  );
}
