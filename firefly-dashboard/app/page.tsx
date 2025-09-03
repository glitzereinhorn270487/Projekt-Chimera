
import { GlassShell } from "@/components/ui/glass-shell";
import { Panel } from "@/components/ui/panel";
import { TopBar } from "@/components/layout/top-bar";

export default function HomePage() {
  return (
    <GlassShell>
      <TopBar />
      <div className="flex-1 p-4 sm:p-6">
        <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {/* Main Chart Panel */}
          <Panel className="sm:col-span-2">
            {/* Placeholder for the main trading chart */}
            <div className="h-full w-full rounded-md bg-white/5"></div>
          </Panel>

          {/* Token/Position List Panel */}
          <Panel>
             {/* Placeholder for the list of tokens or open positions */}
            <div className="h-full w-full rounded-md bg-white/5"></div>
          </Panel>

          {/* Action/Log Panel */}
          <Panel className="sm:col-span-3">
             {/* Placeholder for action buttons or a log feed */}
            <div className="h-full w-full rounded-md bg-white/5"></div>
          </Panel>
        </div>
      </div>
    </GlassShell>
  );
}
