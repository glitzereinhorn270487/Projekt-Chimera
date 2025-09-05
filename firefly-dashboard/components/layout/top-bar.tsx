// firefly-dashboard/components/layout/top-bar.tsx
import { Panel } from "@/components/ui/panel";
import OnOffButton from "@/components/OnOffButton";

export function TopBar() {
  return (
    <Panel title="Firefly" className="flex items-center justify-between">
      <div className="t-soft"> </div>
      <div className="flex items-center gap-3">
        <OnOffButton />
        <a className="btn" href="/settings">Settings</a>
      </div>
    </Panel>
  );
}
