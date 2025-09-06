"use client";

import { motion } from "framer-motion";
import { PropsWithChildren, useState } from "react";

export function FlipPanel({
  front,
  back,
  flipped: extFlipped,
  onToggle,
  minHeight = "min-h-[420px]",
}: PropsWithChildren<{
  front: React.ReactNode;
  back: React.ReactNode;
  flipped?: boolean;
  onToggle?: (v: boolean) => void;
  minHeight?: string;
}>) {
  const [int, setInt] = useState(false);
  const flipped = extFlipped ?? int;

  function toggle() {
    const v = !flipped;
    setInt(v);
    onToggle?.(v);
  }

  return (
    <div className={`relative perspective-[1200px] ${minHeight}`}>
      <motion.div
        className="glass [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">
          {front}
        </div>
        <div className="absolute inset-0 rotate-y-180 [backface-visibility:hidden]">
          {back}
        </div>
      </motion.div>

      <button
        onClick={toggle}
        className="absolute top-4 left-4 btn btn-primary"
      >
        {flipped ? "Zurück" : "Details"}
      </button>
    </div>
  );
}
