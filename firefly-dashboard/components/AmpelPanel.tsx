// firefly-dashboard/components/AmpelPanel.tsx
"use client";
import { Panel } from "@/components/ui/panel";
import { motion } from "framer-motion";

export default function AmpelPanel({ score = 55 }: { score?: number }) {
  const state = score >= 70 ? "green" : score >= 40 ? "yellow" : "red";
  return (
    <Panel title="Ampel" className="flex items-center gap-6">
      <div className="flex items-center gap-6">
        <motion.div
          className={`amp-dot amp-red ${state === "red" ? "animate-pulse-soft" : "opacity-40"}`}
          animate={state === "red" ? { scale: [1, 1.04, 1] } : {}}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <motion.div
          className={`amp-dot amp-yellow ${state === "yellow" ? "animate-pulse-soft" : "opacity-40"}`}
          animate={state === "yellow" ? { scale: [1, 1.04, 1] } : {}}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <motion.div
          className={`amp-dot amp-green ${state === "green" ? "animate-pulse-soft" : "opacity-40"}`}
          animate={state === "green" ? { scale: [1, 1.04, 1] } : {}}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </div>
      <p className="t-muted">
        {state === "green" && "Grün – Liquidity & Momentum gut, Risk moderat."}
        {state === "yellow" && "Gelb – neutral; Beobachten & kleiner hebeln."}
        {state === "red" && "Rot – Risiko hoch; nur defensive Trades."}
      </p>
    </Panel>
  );
}
