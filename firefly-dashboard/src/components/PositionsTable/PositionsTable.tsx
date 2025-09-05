"use client";
import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import type { TradeRow } from "@/types/trade";
import { columns } from "./columns"; // ✅ Array importieren

export function PositionsTable({ data }: { data: TradeRow[] }) {
  const table = useReactTable<TradeRow>({
    data,
    columns,                 // ✅ kein Funktionsaufruf
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full text-sm">
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => (
              <th key={h.id} className="text-left py-2">
                {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((r) => (
          <tr key={r.id} className="border-t border-white/10">
            {r.getVisibleCells().map((c) => (
              <td key={c.id} className="py-2">
                {flexRender(c.column.columnDef.cell, c.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
