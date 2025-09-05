"use client";
import * as React from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type { TradeRow } from "@/types/trade";

const h = createColumnHelper<TradeRow>();

export const columns: ColumnDef<TradeRow, any>[] = [
  h.accessor("chain", {
    header: "Chain",
    cell: (ctx) => <span className="px-2 py-0.5 rounded-md text-xs bg-white/10">{ctx.getValue()}</span>
  }),
  h.accessor("category", { header: "Kategorie" }),
  h.accessor("narrative", { header: "Narrativ" }),
  h.accessor("scoreX", {
    header: "Score",
    cell: (ctx) => {
      const v = ctx.getValue<number>();
      const tone = v >= 70 ? "text-emerald-400" : v >= 40 ? "text-amber-400" : "text-rose-400";
      return <span className={tone}>{v}</span>;
    }
  }),
  h.accessor("marketcap", {
    header: "MCap",
    cell: (ctx) => <span>${ctx.getValue<number>().toLocaleString()}</span>,
  }),
  h.accessor("volume24h", {
    header: "Vol 24h",
    cell: (ctx) => <span>${ctx.getValue<number>().toLocaleString()}</span>,
  }),
  h.accessor("initialInvestment", {
    header: "Invest",
    cell: (ctx) => <span>${ctx.getValue<number>().toLocaleString()}</span>,
  }),
  h.accessor("pnlAbs", {
    header: "PnL",
    cell: (ctx) => {
      const v = ctx.getValue<number>();
      const c = v >= 0 ? "text-emerald-400" : "text-rose-400";
      return <span className={c}>{v.toFixed(2)}</span>;
    }
  }),
  h.display({
    id: "actions",
    header: "",
    cell: (ctx) => {
      const row = ctx.row.original;
      async function onClose() {
        await fetch(`/api/positions/${row.id}/close`, { method: "POST" });
        // optional: toast / refetch trigger
      }
      return (
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 rounded-md bg-cyan-500/15 ring-1 ring-cyan-400/30 hover:ring-cyan-400/60"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      );
    }
  })
];
