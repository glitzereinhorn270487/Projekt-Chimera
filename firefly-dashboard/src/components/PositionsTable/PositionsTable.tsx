"use client";
import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, TradeRowsSchema } from "@/lib/api";
import { TradeRow } from "@/types/trade";
import { useReactTable, getCoreRowModel, flexRender, SortingState, getSortedRowModel } from "@tanstack/react-table";
import { columns as makeColumns } from "./columns";
import { toast } from "sonner";

export default function PositionsTable({ status }: { status: "open" | "closed" }) {
  const qc = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data } = useQuery({
    queryKey: ["positions", status],
    queryFn: async () => TradeRowsSchema.parse(await api<unknown>(`/api/positions?status=${status}`)),
    refetchInterval: 5000, // Live-Update
  });

  const closeMutation = useMutation({
    mutationFn: async (id: string) => api(`/api/positions/${id}/close`, { method: "POST" }),
    onSuccess: () => {
      toast.success("Position geschlossen");
      qc.invalidateQueries({ queryKey: ["positions", "open"] });
      qc.invalidateQueries({ queryKey: ["positions", "closed"] });
    },
    onError: (e: any) => toast.error(e.message || "Close fehlgeschlagen"),
  });

  const cols = useMemo(() => makeColumns((id) => closeMutation.mutate(id)), [closeMutation]);

  const table = useReactTable({
    data: data ?? [],
    columns: cols,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left text-white/70 sticky top-0">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th key={h.id} className="px-3 py-2 cursor-pointer select-none" onClick={h.column.getToggleSortingHandler()}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                  {{ asc: " ↑", desc: " ↓" }[h.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="[&>tr:hover]:bg-white/5">
          {table.getRowModel().rows.map(r => (
            <tr key={r.id} className="border-t border-white/10">
              {r.getVisibleCells().map(c => (
                <td key={c.id} className="px-3 py-2">{flexRender(c.column.columnDef.cell, c.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
