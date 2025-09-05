"use client";
import useSWR from "swr";
import { Panel } from "@/components/ui/panel";
import { api, CapitalSchema } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

export default function CapitalTile() {
  const { data, isLoading, error, mutate } = useSWR(
    "/api/capital",
    (p) => api(p).then(CapitalSchema.parse),
    { refreshInterval: 15_000, revalidateOnFocus: false }
  );

  return (
    <Panel
      title="Capital"
      actions={
        <button
          onClick={() => mutate()}
          className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20"
        >
          Refresh
        </button>
      }
    >
      {error && (
        <div className="text-red-300 text-sm">Konnte Capital nicht laden.</div>
      )}
      <div className="flex items-end gap-8">
        <div>
          <div className="text-xs uppercase tracking-wide text-white/60">
            USD
          </div>
          <div className="text-3xl font-semibold">
            {isLoading || !data ? "…" : formatCurrency(data.usd)}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-white/60">
            SOL
          </div>
          <div className="text-3xl font-semibold">
            {isLoading || !data
              ? "…"
              : data.sol.toLocaleString(undefined, {
                  maximumFractionDigits: 4,
                })}
          </div>
        </div>
      </div>
    </Panel>
  );
}
