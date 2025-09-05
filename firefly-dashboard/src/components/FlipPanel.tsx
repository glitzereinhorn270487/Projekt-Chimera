"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";

export function FlipPanel({ front, back }: { front: React.ReactNode; back: React.ReactNode }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="relative perspective-1200">
      <motion.div
        className="glass [transform-style:preserve-3d] min-h-[540px]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">{front}</div>
        <div className="absolute inset-0 rotate-y-180 [backface-visibility:hidden]">{back}</div>
      </motion.div>
      <button
        onClick={() => setFlipped(!flipped)}
        className="absolute top-4 left-4 rounded-full px-3 py-1 bg-cyan/10 ring-1 ring-cyan/30 hover:ring-cyan/50"
      >
        {flipped ? "Zurück" : "Details"}
      </button>
    </div>
  );
}
