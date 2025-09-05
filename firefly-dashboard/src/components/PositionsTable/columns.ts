import { createColumnHelper } from "@tanstack/react-table";
import { TradeRow } from "@/types/trade";
import { fmtUsd, fmtPct } from "@/lib/format";

const h = createColumnHelper<TradeRow>();

export const columns = (onClose: (id: string)=>void) => [
  h.accessor("chain", { header: "Chain" }),
  h.accessor("category", { header: "Kategorie" }),
  h.accessor("narrative", { header: "Narrativ" }),
  h.accessor("scoreX", { header: "ScoreX", cell: i => <span className="px-2 py-0.5 rounded-md text-xs bg-white/10">{i.getValue()}</span> }),
  h.accessor("marketcap", { header: "MC", cell: i => fmtUsd(i.getValue()) }),
  h.accessor("volume24h", { header: "Vol 24h", cell: i => fmtUsd(i.getValue()) }),
  h.accessor("initialInvestment", { header: "Invest", cell: i => fmtUsd(i.getValue()) }),
  h.accessor("pnlAbs", { header: "PnL", cell: i => fmtUsd(i.getValue()) }),
  h.accessor("pnlPct", { header: "%", cell: i => <span className={i.getValue()>=0?"text-emerald-300":"text-red-300"}>{fmtPct(i.getValue())}</span> }),
  h.display({
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <button onClick={() => onClose(row.original.id)}
        className="px-3 py-1 rounded-md bg-red-500/15 border border-red-500/30 hover:bg-red-500/25">
        Close Position
      </button>
    )
  })
];
