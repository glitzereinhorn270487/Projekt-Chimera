// firefly-dashboard/components/ui/panel.tsx
import * as React from "react";

type PanelProps = {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function Panel({ title, children, actions, className = "" }: PanelProps) {
  return (
    <section className={`glass neon-ring p-6 md:p-8 ${className}`}>
      <header className="flex items-center justify-between mb-4">
        <h3 className="t-soft tracking-wide">{title}</h3>
        <div className="flex gap-2">{actions}</div>
      </header>
      {children}
    </section>
  );
}
