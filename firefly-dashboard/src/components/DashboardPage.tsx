"use client";

import  AmpelPanel  from "@/components/AmpelPanel";
import { Panel } from "@/components/ui/panel";
import { CapitalTile } from "../../components/tiles/capital-tile";
import { PnlTile } from "../../components/tiles/pnl-tile";
import { OnOffButton } from "../../components/OnOffButton";
import { OpenPositionsPanel } from "../../components/trades/open-positions-panel";
import { ClosedPositionsPanel } from "../../components/trades/closed-positions-panel";
import { TaxExportPanel } from "components/tax/TaxExportPanel";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-10 space-y-6">
      {/* Top: Agent + Settings (Settings-Button hast du bereits rechts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OnOffButton />
        <CapitalTile />
        <PnlTile />
      </div>

      {/* Mitte: Tabellen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OpenPositionsPanel />
        <ClosedPositionsPanel />
      </div>

      {/* Unten: Ampel + Steuer-Export */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AmpelPanel score={0} />
        <TaxExportPanel />
      </div>
    </div>
  );
}
