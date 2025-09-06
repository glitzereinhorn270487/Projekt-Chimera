"use client";

import { useEffect, useRef, useState } from "react";

export default function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button className="btn btn-primary" onClick={() => setOpen((v) => !v)}>
        Einstellungen
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 glass ring-1 ring-white/10 p-3 space-y-3">
          <div className="t-soft text-sm">Benachrichtigungen (Telegram)</div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked className="accent-cyan-400" />
            Global aktiv
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-cyan-400" />
            Trades
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-cyan-400" />
            Risiko
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-cyan-400" />
            PnL / Steuer
          </label>

          <div className="flex justify-end">
            <button
              className="btn"
              onClick={() => {
                setOpen(false);
                // später: POST /api/notifications/telegram
              }}
            >
              Speichern
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
