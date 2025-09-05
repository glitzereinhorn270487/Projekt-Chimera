// firefly-dashboard/src/components/ui/panel.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  children,
  actions,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("glass glow-cyan p-6 md:p-8", className)}>
      {title && (
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-sky-100/90 tracking-wide">{title}</h3>
          <div className="flex gap-2">{actions}</div>
        </header>
      )}
      {children}
    </section>
  );
}
