// firefly-dashboard/src/components/settings/settings-sheet.tsx
"use client";

import * as React from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type NotifSettings = { global: boolean; trades: boolean };
type InvestLevel = "konservativ" | "moderat" | "aggressiv";

export function SettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [notif, setNotif] = React.useState<NotifSettings>({ global: true, trades: true });
  const [invest, setInvest] = React.useState<InvestLevel>("moderat");

  return (
    <Sheet /* optional kontrolliert: open={open} onOpenChange={setOpen} */>
      <SheetTrigger asChild>
        <button className="btn btn-primary">Einstellungen</button>
      </SheetTrigger>

      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Einstellungen</SheetTitle>
          <SheetDescription>Benachrichtigungen &amp; Invest-Stufe verwalten.</SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          <label className="flex items-center justify-between gap-4 glass p-3 rounded-2xl">
            <div>
              <div className="t-strong">Benachrichtigungen (global)</div>
              <div className="t-muted text-sm">Master-Switch für alle Hinweise</div>
            </div>
            <Switch
              checked={notif.global}
              onCheckedChange={(v: boolean) => setNotif((s) => ({ ...s, global: v }))}
            />
          </label>

          <label className="flex items-center justify-between gap-4 glass p-3 rounded-2xl">
            <div>
              <div className="t-strong">Trade-Events</div>
              <div className="t-muted text-sm">Öffnen/Schließen, PnL-Schwellen</div>
            </div>
            <Switch
              checked={notif.trades}
              onCheckedChange={(v: boolean) => setNotif((s) => ({ ...s, trades: v }))}
            />
          </label>

          <div className="glass p-3 rounded-2xl">
            <div className="t-strong mb-2">Invest-Stufe</div>
            <div className="flex gap-2">
              {(["konservativ", "moderat", "aggressiv"] as InvestLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  className={cn(
                    "btn",
                    invest === lvl ? "btn-primary" : ""
                  )}
                  onClick={() => setInvest(lvl)}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter>
          <SheetClose className="btn">Schließen</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
