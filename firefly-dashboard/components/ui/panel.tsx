import * as React from "react";

type PanelProps = {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string; // <— neu
};

export function Panel({ title, children, actions, className }: PanelProps) {
  const base = "glass glow-cyan p-6 md:p-8";
  return (
    <section className={`${base} ${className ?? ""}`}>
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-sky-100/90 tracking-wide">{title}</h3>
        <div className="flex gap-2">{actions}</div>
      </header>
      {children}
    </section>
  );
}

export default Panel; // optionaler Default-Export für flexible Imports
