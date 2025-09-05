"use client";

import { useState } from "react";

type Props = {
  onAdded?: () => void; // optionaler Callback nach erfolgreichem Add
};

export default function AddPositionForm({ onAdded }: Props) {
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [entryPrice, setEntryPrice] = useState<number | "">("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // TODO: Hier später an echte API anbinden
    // await fetch("/api/positions", { method: "POST", body: JSON.stringify({ ... }) });

    onAdded?.(); // Panel kann danach neu laden
    setSymbol("");
    setAmount("");
    setEntryPrice("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex flex-col">
        <label className="text-xs opacity-60">Symbol</label>
        <input
          className="rounded-md border border-white/10 bg-white/5 px-2 py-1"
          placeholder="SOL"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs opacity-60">Amount</label>
        <input
          type="number"
          step="any"
          className="rounded-md border border-white/10 bg-white/5 px-2 py-1"
          placeholder="100"
          value={amount}
          onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs opacity-60">Entry $</label>
        <input
          type="number"
          step="any"
          className="rounded-md border border-white/10 bg-white/5 px-2 py-1"
          placeholder="150.25"
          value={entryPrice}
          onChange={(e) => setEntryPrice(e.target.value === "" ? "" : Number(e.target.value))}
          required
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-cyan/20 px-3 py-2 text-sm ring-1 ring-cyan/40 hover:ring-cyan/70"
      >
        Add Position
      </button>
    </form>
  );
}
