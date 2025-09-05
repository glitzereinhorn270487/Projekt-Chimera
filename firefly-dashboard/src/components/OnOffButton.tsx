"use client";
import React, { useState } from "react";
export default function OnOffButton(){
  const [on, setOn] = useState(false);
  return (
    <button onClick={()=>setOn(x=>!x)}
      className={`px-4 py-2 rounded-full border ${on?"border-emerald-400/40 bg-emerald-400/10":"border-white/20 bg-white/5"}`}>
      {on ? "Bot ON" : "Bot OFF"}
    </button>
  );
}
