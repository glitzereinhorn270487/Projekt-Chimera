
import { GlassShell } from "@/components/ui/glass-shell";
import { TopBar } from "@/components/layout/top-bar";
import { OpenPositionsPanel } from "@/components/trades/open-positions-panel";
import { ClosedPositionsPanel } from "@/components/trades/closed-positions-panel";
import { Panel } from "@/components/ui/panel";

export default function HomePage() {
  return (
    <GlassShell>
      <TopBar />
      <main className="flex-1 p-4 sm:p-6">
        <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          <div className="sm:col-span-2 h-full">
             <OpenPositionsPanel />
          </div>

          <div className="h-full">
            <ClosedPositionsPanel />
          </div>
          
          <div className="sm:col-span-3">
            <Panel>
                {/* Placeholder for action buttons or a log feed */}
                <div className="h-full w-full rounded-md bg-white/5"></div>
            </Panel>
          </div>

        </div>
      </main>
    </GlassShell>
  );
}
