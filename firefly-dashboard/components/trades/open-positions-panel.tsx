// firefly-dashboard/components/trades/open-positions-panel.tsx
"use client";
import { Panel } from "@/components/ui/panel";
import { useTrades } from "../../hooks/use-trades";
import { TradeTable } from "../../components/trades/trade-table";
import { openPositionsColumns } from "../../components/trades/columns";
import type { Trade } from "@/types/trade";

export function OpenPositionsPanel() {
  const trades = useTrades();
  return (
    <Panel title="Offene Positionen">
      <TradeTable<Trade> columns={openPositionsColumns} data={trades.open} />
    </Panel>
  );
}
