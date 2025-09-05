"use client";
import { Panel } from "@/components/ui/panel";
import { useState } from "react";

export function TaxExportPanel() {
  const [from, setFrom] = useState<string>(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0,10));
  const [to, setTo] = useState<string>(new Date().toISOString().slice(0,10));
  const [format, setFormat] = useState<"txt"|"csv">("txt");

  const download = () => {
    const url = `/api/tax/export?from=${from}&to=${to}&format=${format}`;
    const a = document.createElement("a");
    a.href = url; a.download = ""; a.click();
  };

  return (
    <Panel title="Steuer-Export" actions={
      <button onClick={download} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10">Download</button>
    }>
      <div className="grid gap-3 md:grid-cols-3 items-end">
        <label className="text-sm opacity-80">
          Von
          <input type="date" value={from}
                 onChange={(e)=>setFrom(e.target.value)}
                 className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
        </label>
        <label className="text-sm opacity-80">
          Bis
          <input type="date" value={to}
                 onChange={(e)=>setTo(e.target.value)}
                 className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2" />
        </label>
        <label className="text-sm opacity-80">
          Format
          <select value={format}
                  onChange={(e)=>setFormat(e.target.value as any)}
                  className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            <option value="txt">TXT</option>
            <option value="csv">CSV</option>
          </select>
        </label>
      </div>
    </Panel>
  );
}
