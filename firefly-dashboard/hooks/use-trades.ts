// firefly-dashboard/hooks/use-trades.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { api, TradeRowsSchema } from "@/lib/api";
import type { Trade } from "@/types/trade";
export type { Trade }; // <- re-export, keine eigene Definition!

export function useTrades() {
  const { data = [] } = useQuery({
    queryKey: ["positions", "all"],
    // Beispiel: du kannst auch getrennte Endpoints verwenden – Hauptsache Schema-validiert
    queryFn: async () => {
      // Hole *alle* Positionen und filtere lokal (einfacher Cache/Refetch)
      const all = await api<unknown>("/api/positions?status=all");
      return TradeRowsSchema.parse(all);
    },
    refetchInterval: 10_000,
  });

  const open = data.filter((t) => t.status === "open") as Trade[];
  const closed = data.filter((t) => t.status === "closed") as Trade[];

  return { open, closed };
}
