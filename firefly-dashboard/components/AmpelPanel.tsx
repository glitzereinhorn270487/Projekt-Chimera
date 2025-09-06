"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/panel";

type Amp = "red" | "yellow" | "green";

export default function AmpelPanel() {
  const [status, setStatus] = useState<Amp>("red");

  const dot = (tone: Amp, label: string, cls: string) => (
    <button
      aria-label={label}
      onClick={() => setStatus(tone)}
      className={`amp-dot ${cls} transition-transform ${
        status === tone ? "scale-110" : "scale-100"
      }`}
    />
  );

  return (
    <Panel title="Ampel – Marktlage">
      <div className="flex items-center gap-6">
        {dot("red", "Rot", "amp-red")}
        {dot("yellow", "Gelb", "amp-yellow")}
        {dot("green", "Grün", "amp-green")}
      </div>
      <p className="t-soft text-sm mt-4">
        {status === "green" && "Grün: Liquidität & Momentum positiv, Risiko niedrig."}
        {status === "yellow" && "Gelb: Neutral – abwarten, kleinere Positionen ok."}
        {status === "red" && "Rot: Vorsicht – Risiko hoch, lieber pausieren."}
      </p>
    </Panel>
  );
}
