import React from "react";

export function Panel({
  title, children, actions,
}: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="glass glow-cyan p-6 md:p-8">
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-sky-100/90 tracking-wide">{title}</h3>
        <div className="flex gap-2">{actions}</div>
      </header>
      {children}
    </section>
  );
}
