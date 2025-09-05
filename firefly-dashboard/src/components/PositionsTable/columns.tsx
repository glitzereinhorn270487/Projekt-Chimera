// firefly-dashboard/src/components/PositionsTable/columns.ts
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { TradeRow } from "@/types/trade";
import { formatCurrency, formatPct, compactNumber } from "@/lib/format";

export const columns: ColumnDef<TradeRow, unknown>[] = [
  { accessorKey: "chain", header: "Chain" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "narrative", header: "Narrative" },
  { accessorKey: "scoreX", header: "Score" },
  {
    accessorKey: "marketcap",
    header: "M.Cap",
    cell: ({ getValue }) => compactNumber(getValue<number>()),
  },
  {
    accessorKey: "volume24h",
    header: "Vol 24h",
    cell: ({ getValue }) => compactNumber(getValue<number>()),
  },
  {
    accessorKey: "initialInvestment",
    header: "Invest",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "pnlAbs",
    header: "PnL $",
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  },
  {
    accessorKey: "pnlPct",
    header: "PnL %",
    cell: ({ getValue }) => formatPct(getValue<number>()),
  },
  // Aktionen (Client-Side Buttons)
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <form action={`/api/positions/${row.original.id}/close`} method="post">
          <button
            type="submit"
            className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20"
          >
            Close
          </button>
        </form>
        <a
          href={`/api/positions/${row.original.id}`} // Detail (stub)
          className="px-2 py-1 rounded-md bg-cyan/10 ring-1 ring-cyan/25 hover:ring-cyan/45"
        >
          Details
        </a>
      </div>
    ),
  },
];
