// firefly-dashboard/components/trades/columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { Trade } from "@/types/trade";
import { formatCurrency, formatPct, compactNumber } from "@/lib/format";

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
    cell: ({ getValue }) => formatPct(getValue<number>()),
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
    cell: ({ getValue }) => formatPct(getValue<number>()),
  },
];
