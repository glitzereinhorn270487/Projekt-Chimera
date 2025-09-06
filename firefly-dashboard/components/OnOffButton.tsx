"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/panel";

export default function OnOffButton() {
  const [running, setRunning] = useState(false);
  const toggle = async () => {
    setRunning((v) => !v); // optimistisch
    try {
      await fetch(`/api/engine/${running ? "stop" : "start"}`, { method: "POST" });
    } catch {
      // falls (noch) kein Backend: ignorieren
    }
  };

  return (
    <Panel
      title="Agent"
      actions={
        <span className={`text-sm ${running ? "text-green-400" : "text-red-400"}`}>
          {running ? "Läuft" : "Gestoppt"}
        </span>
      }
      className="relative"
    >
      <button className="btn btn-primary" onClick={toggle}>
        {running ? "Agent stoppen" : "Agent starten"}
      </button>
      <p className="t-muted mt-3 text-sm">
        Steuert die Trading-Engine (derzeit Stub – Backend kann später verdrahtet werden).
      </p>
    </Panel>
  );
}
