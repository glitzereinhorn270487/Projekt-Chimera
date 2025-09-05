// firefly-dashboard/src/components/DashboardPage.tsx
"use client";

import { TopBar } from "../../components/layout/top-bar";
import { OpenPositionsPanel } from "../../components/trades/open-positions-panel";
import { ClosedPositionsPanel } from "../../components/trades/closed-positions-panel";
import { CapitalTile } from "../../components/tiles/capital-tile";
import { PnlTile } from "../../components/tiles/pnl-tile";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <TopBar />
      <div className="grid gap-4 md:grid-cols-2">
        <CapitalTile />
        <PnlTile />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <OpenPositionsPanel />
        <ClosedPositionsPanel />
      </div>
      {/* Steuer-Export, Ampel etc. später hier */}
    </div>
  );
}
