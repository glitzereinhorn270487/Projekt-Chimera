"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function FlipPanel({
  front,
  back,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="relative perspective-[1200px]">
      <motion.div
        className="glass [transform-style:preserve-3d] min-h-[420px]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="absolute inset-0 p-6 [backface-visibility:hidden]">
          {front}
        </div>
        <div className="absolute inset-0 p-6 rotate-y-180 [backface-visibility:hidden]">
          {back}
        </div>
      </motion.div>

      <button
        onClick={() => setFlipped((v) => !v)}
        className="absolute top-4 left-4 rounded-full px-3 py-1 bg-cyan/10 ring-1 ring-cyan/30 hover:ring-cyan/50"
      >
        {flipped ? "Zurück" : "Details"}
      </button>
    </div>
  );
}
