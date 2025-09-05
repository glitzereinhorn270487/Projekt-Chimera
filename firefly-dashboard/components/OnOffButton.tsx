"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Panel } from "@/components/ui/panel";

export function OnOffButton() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["engine-state"],
    queryFn: async () => (await fetch("/api/engine/state")).json() as Promise<{running:boolean}>,
  });

  const mut = useMutation({
    mutationFn: async (running: boolean) =>
      (await fetch("/api/engine/state", { method: "POST", body: JSON.stringify({ running }) })).json(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["engine-state"] }),
  });

  const running = !!data?.running;

  return (
    <Panel
      title="Firefly"
      actions={
        <button
          onClick={() => mut.mutate(!running)}
          className={`px-4 py-2 rounded-xl border border-white/10
            ${running ? "bg-emerald-500/20 hover:bg-emerald-500/30" : "bg-rose-500/20 hover:bg-rose-500/30"}`}>
          {running ? "Stop Agent" : "Start Agent"}
        </button>
      }
      className="p-4"
    >
      <div className="text-sm opacity-70">{running ? "Agent läuft." : "Agent gestoppt."}</div>
    </Panel>
  );
}
