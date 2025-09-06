"use client";

import { Panel } from "@/components/ui/panel";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function AmpelPanel({
  score = 58,
  hints = [
    "Liquidität okay",
    "Momentum neutral",
    "Risiko erhöht",
  ],
}: {
  score?: number;   // 0–100
  hints?: string[];
}) {
  const state: "red" | "yellow" | "green" =
    score < 40 ? "red" : score < 70 ? "yellow" : "green";

  return (
    <Panel title="Markt-Ampel" actions={<Badge score={score} />}>
      <div className="flex items-center gap-6 py-2">
        <Dot active={state === "red"} color="red" />
        <Dot active={state === "yellow"} color="yellow" />
        <Dot active={state === "green"} color="green" />
      </div>

      <ul className="mt-4 list-disc pl-5 t-soft space-y-1">
        {hints.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </Panel>
  );
}

function Dot({
  color,
  active,
}: {
  color: "red" | "yellow" | "green";
  active: boolean;
}) {
  const base =
    color === "red"
      ? "amp-red"
      : color === "yellow"
      ? "amp-yellow"
      : "amp-green";

  return (
    <motion.div
      className={clsx("amp-dot", base)}
      animate={{ scale: active ? 1.08 : 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{
        boxShadow: active ? "0 0 32px rgba(46,230,154,.35)" : undefined,
      }}
      aria-label={color}
    />
  );
}

function Badge({ score }: { score: number }) {
  const color = score < 40 ? "text-red-400" : score < 70 ? "text-yellow-300" : "text-emerald-300";
  return (
    <span className={`t-soft ${color} text-sm px-2 py-1 rounded-md ring-1 ring-white/10`}>
      Score {score}
    </span>
  );
}
