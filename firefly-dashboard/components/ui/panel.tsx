// components/ui/panel.tsx
import * as React from "react";

type Props = {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string; // <- wichtig
};

export function Panel({ title, actions, children, className }: Props) {
  return (
    <section className={`glass glow-cyan p-6 md:p-8 ${className ?? ""}`}>
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-sky-100/90 tracking-wide">{title}</h3>
        <div className="flex gap-2">{actions}</div>
      </header>
      {children}
    </section>
  );
}
