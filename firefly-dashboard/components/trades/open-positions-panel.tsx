"use client";

import Panel from "../ui/panel";                // Default-Export (s. Panel-Update unten)
import { openPositionsColumns } from "./columns";
import { TradeTable } from "./trade-table";     // falls dein trade-table default exportiert, -> `import TradeTable from "./trade-table"`
import AddPositionForm from "./add-position-form";
import { useTrades } from "../../hooks/use-trades";
import type { TradeRow } from "@/types/trade";

type TradesQueryShape =
  | { open: TradeRow[]; closed: TradeRow[] } // einfache Daten
  | {
      data: { open: TradeRow[]; closed: TradeRow[] }; // react-query shape
      isLoading?: boolean;
      error?: unknown;
      refetch?: () => void;
    };

export function OpenPositionsPanel() {
  const result = useTrades() as TradesQueryShape;

  const rows: TradeRow[] =
    "data" in result ? result.data.open ?? [] : result.open ?? [];

  const isLoading = "data" in result ? Boolean(result.isLoading) : false;
  const error = "data" in result ? (result.error as Error | undefined) : undefined;
  const refetch = "data" in result ? result.refetch : undefined;

  return (
    <Panel
      title="Offene Positionen"
      actions={<AddPositionForm onAdded={() => refetch?.()} />}
    >
      {isLoading && (
        <div className="text-center text-gray-400 py-8">
          Lade offene Positionen …
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center text-red-400 py-8">
          Fehler beim Laden: {error.message}
        </div>
      )}

      {!isLoading && !error && rows.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          Keine offenen Positionen.
        </div>
      )}

      {!isLoading && !error && rows.length > 0 && (
        <TradeTable columns={openPositionsColumns} data={rows} />
      )}
    </Panel>
  );
}

export default OpenPositionsPanel;
