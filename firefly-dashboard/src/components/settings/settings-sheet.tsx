// firefly-dashboard/src/components/settings/settings-sheet.tsx
"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader,
  SheetTitle, SheetDescription, SheetFooter, SheetClose,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

// … (dein State/Fetching wie zuvor)

<Sheet /* open={open} onOpenChange={setOpen}  optional */>
  <SheetTrigger asChild>
    <button className="btn btn-primary">Einstellungen</button>
  </SheetTrigger>

  <SheetContent>
    <SheetHeader>
      <SheetTitle>Einstellungen</SheetTitle>
      <SheetDescription>Benachrichtigungen &amp; Invest-Stufe verwalten.</SheetDescription>
    </SheetHeader>

    {/* Beispiel Toggle */}
    <label className="flex items-center justify-between gap-4 glass p-3 rounded-2xl">
      <div>
        <div className="t-strong">Global</div>
        <div className="t-muted text-sm">Master-Switch für alle Themen</div>
      </div>
      <Switch
        checked={notif.global}
        onCheckedChange={(v: boolean) => setNotif({ ...notif, global: v })}
      />
    </label>

    <SheetFooter>
      <SheetClose className="btn">Schließen</SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
function setNotif(arg0: any): void {
  throw new Error("Function not implemented.");
}

