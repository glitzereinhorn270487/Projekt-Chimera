// firefly-dashboard/components/trades/columns.ts
import type { ColumnDef } from "@tanstack/react-table";
import type { Trade } from "@/types/trade";
import { formatCurrency, fmtPct, compactNumber } from "@/lib/format";

export const openPositionsColumns: ColumnDef<Trade, any>[] = [
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
    cell: ({ getValue }) => fmtPct(getValue<number>()),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => (
      <form action={`/api/positions/${row.original.id}/close`} method="post">
        <button
          type="submit"
          className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20"
        >
          Close
        </button>
      </form>
    ),
  },
];

export const closedPositionsColumns: ColumnDef<Trade, any>[] = [
  { accessorKey: "chain", header: "Chain" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "narrative", header: "Narrative" },
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
    cell: ({ getValue }) => fmtPct(getValue<number>()),
  },
];
