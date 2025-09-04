
'use client';

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Trade } from '../../hooks/use-trades';
import { TradeRow } from './trade-row';

interface TradeTableProps {
  data: Trade[];
  columns: ColumnDef<Trade>[];
}

export function TradeTable({ data, columns }: TradeTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-auto">
      <table className="min-w-full table-auto">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-white/20">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 text-left text-xs font-semibold uppercase text-gray-400">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
               <th className="w-12 px-4 py-2"></th> {/* For action button */}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <TradeRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
