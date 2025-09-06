"use client";

import  AmpelPanel  from "@/components/AmpelPanel";
import { Panel } from "@/components/ui/panel";
import { CapitalTile } from "../../components/tiles/capital-tile";
import { PnlTile } from "../../components/tiles/pnl-tile";
import OnOffButton from "../../components/OnOffButton";
import { OpenPositionsPanel } from "../../components/trades/open-positions-panel";
import { ClosedPositionsPanel } from "../../components/trades/closed-positions-panel";
import { TaxExportPanel } from "components/tax/TaxExportPanel";
import SettingsMenu from "../../components/SettingsMenu";

export default function DashboardPage() {
  return (
    <div className="relative">
      {/* Settings oben rechts */}
      <div className="absolute right-6 top-6 z-10">
        <SettingsMenu />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LINKS OBEN: Agent starten/stoppen */}
        <OnOffButton />

        {/* MITTE/RECHTS OBEN: Capital / PnL – bleiben wie bei dir */}
        {/* <CapitalTile /> <PnlTile /> ... */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <OpenPositionsPanel />
        {/* <ClosedPositionsPanel /> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* LINKS UNTEN: Ampel */}
        <AmpelPanel score={0} />
        {/* Mitte/Right: Steuer-Export, PnL-Zeitraum etc. */}
      </div>
    </div>
  );
}
