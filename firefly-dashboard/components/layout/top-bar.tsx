// firefly-dashboard/components/layout/top-bar.tsx
"use client";

import { Panel } from "@/components/ui/panel";
import { Flame } from "lucide-react";

export function TopBar() {
  return (
    <Panel
      title="Firefly"
      actions={
        <button className="px-3 py-1 rounded-md bg-cyan/10 ring-1 ring-cyan/25 hover:ring-cyan/45">
          Settings
        </button>
      }
    >
      <div className="flex items-center gap-2">
        <Flame className="h-6 w-6 text-yellow-400" />
        <span className="text-white/90">Bot Control Center</span>
      </div>
    </Panel>
  );
}
