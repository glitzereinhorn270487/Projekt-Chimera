// DashboardPage.tsx
import { PositionsTable } from "@/components/PositionsTable/PositionsTable";
import { useQuery } from "@tanstack/react-query";
import { api, TradeRowSchema } from "@/lib/api";
import { z } from "zod";

async function fetchPositions(status: "open" | "closed") {
  return await api<z.infer<typeof TradeRowSchema>[]>(`/api/positions?status=${status}`);
}

export default function DashboardPage() {
  const { data: open = [] } = useQuery({ queryKey: ["positions", "open"], queryFn: () => fetchPositions("open") });
  const { data: closed = [] } = useQuery({ queryKey: ["positions", "closed"], queryFn: () => fetchPositions("closed") });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PositionsTable data={open} />
      <PositionsTable data={closed} />
    </div>
  );
}
