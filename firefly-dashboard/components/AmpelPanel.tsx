"use client";
import { Panel } from "@/components/ui/panel";
import { motion } from "framer-motion";

function dot(color:string, active:boolean){
  return (
    <motion.div
      className={`h-6 w-6 rounded-full ${color}`}
      animate={{ opacity: active ? 1 : 0.25, scale: active ? 1.08 : 1 }}
      transition={{ repeat: active ? Infinity : 0, repeatType: "mirror", duration: 1.6 }}
    />
  );
}

export function AmpelPanel({ score = 62 }: { score?: number }) {
  // 0..100 -> rot/gelb/grün
  const state = score > 70 ? "green" : score >= 40 ? "yellow" : "red";
  return (
    <Panel title="Ampel (Marktlage)">
      <div className="flex items-center gap-4">
        {dot("bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.35)]", state==="red")}
        {dot("bg-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.30)]", state==="yellow")}
        {dot("bg-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.30)]", state==="green")}
        <div className="ml-4 text-sm opacity-80">
          Score: <span className="font-medium">{score}</span> — {state === "green" ? "positiv" : state === "yellow" ? "neutral" : "riskant"}
        </div>
      </div>
    </Panel>
  );
}
