// firefly-dashboard/components/trades/closed-positions-panel.tsx
"use client";
import { Panel } from "@/components/ui/panel";
import { useTrades } from "../../hooks/use-trades";
import { TradeTable } from "../../components/trades/trade-table";
import { closedPositionsColumns } from "../../components/trades/columns";
import type { Trade } from "@/types/trade";

export function ClosedPositionsPanel() {
  const trades = useTrades();
  if (trades.closed.length === 0) {
    return (
      <Panel title="Geschlossene Positionen">
        <div className="text-center text-gray-400">No closed positions.</div>
      </Panel>
    );
  }
  return (
    <Panel title="Geschlossene Positionen">
      <TradeTable<Trade> columns={closedPositionsColumns} data={trades.closed} />
    </Panel>
  );
}
