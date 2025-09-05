"use client";
import { useState } from "react";

export default function SettingsMenu() {
  const [global, setGlobal] = useState(true);
  return (
    <div className="glass glow-cyan p-4 rounded-2xl text-sm">
      <div className="flex items-center justify-between">
        <span>Telegram Benachrichtigungen</span>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={global}
            onChange={(e) => setGlobal(e.target.checked)}
          />
          <span>{global ? "Ein" : "Aus"}</span>
        </label>
      </div>
    </div>
  );
}
