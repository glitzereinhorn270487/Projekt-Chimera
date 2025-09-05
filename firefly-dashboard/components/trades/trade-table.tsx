// firefly-dashboard/components/trades/trade-table.tsx
"use client";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

type Props<T> = {
  columns: ColumnDef<T, any>[];
  data: T[];
  className?: string;
};

export function TradeTable<T>({ columns, data, className }: Props<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable<T>({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={className}>
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 bg-black/40 backdrop-blur">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="px-3 py-2 text-left font-medium">
                  {header.isPlaceholder ? null : (
                    <button
                      onClick={header.column.getToggleSortingHandler()}
                      className="hover:underline"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t border-white/10">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
