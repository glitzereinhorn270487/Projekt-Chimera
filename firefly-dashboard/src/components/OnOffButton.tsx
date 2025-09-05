import { useState } from "react";
import { Panel } from "@/components/ui/panel";

function OnOffButton() {
  const [running, setRunning] = useState(false);

  return (
    <Panel
      title="Agent"
      actions={
        <button
          onClick={() => setRunning((v) => !v)}
          className={`px-3 py-1 rounded-md ring-1 ${
            running
              ? "bg-emerald-500/15 ring-emerald-400/40 text-emerald-200"
              : "bg-rose-500/15 ring-rose-400/40 text-rose-200"
          }`}
        >
          {running ? "Stop" : "Start"}
        </button>
      }
      className="flex items-center justify-between"
    >
      <div className="text-sky-100/80">
        Status:{" "}
        <span className={running ? "text-emerald-300" : "text-rose-300"}>
          {running ? "running" : "stopped"}
        </span>
      </div>
    </Panel>
  );
}

export default OnOffButton; // Default
export { OnOffButton };     // Named
