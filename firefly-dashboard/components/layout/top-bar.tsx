
import { Panel } from "@/components/ui/panel";
import { Flame } from "lucide-react";

export function TopBar() {
  return (
    <Panel className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-2">
        <Flame className="h-6 w-6 text-yellow-400" />
        <h1 className="text-xl font-bold text-white">Firefly</h1>
      </div>
      {/* Placeholder for wallet connection button */}
      <div className="h-9 w-32 rounded-md bg-white/10"></div>
    </Panel>
  );
}
