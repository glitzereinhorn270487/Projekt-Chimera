"use client";
import React from "react";

export default function AmpelPanel({ score }: { score: number }) {
  const color = score > 70 ? "bg-emerald-500" : score > 40 ? "bg-yellow-400" : "bg-red-500";
  return (
    <div className="flex items-center justify-center gap-6 py-6">
      {["red","yellow","emerald"].map((c,i)=>(
        <div key={i} className={`w-10 h-10 rounded-full ${["bg-red-500","bg-yellow-400","bg-emerald-500"][i]} ${i=== (score>70?2:score>40?1:0) ? "ring-4 ring-cyan-400/40 shadow-[0_0_30px_rgba(49,208,198,0.35)]" : "opacity-60"}`} />
      ))}
    </div>
  );
}
