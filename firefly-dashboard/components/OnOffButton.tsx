import * as React from "react";

type PanelProps = React.PropsWithChildren<{
  title: string;
  actions?: React.ReactNode;
  className?: string; // <-- neu
}> & React.HTMLAttributes<HTMLElement>;

export function Panel({ title, actions, className, children, ...rest }: PanelProps) {
  const base = "glass glow-cyan p-6 md:p-8";
  return (
    <section className={`${base} ${className ?? ""}`} {...rest}>
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-sky-100/90 tracking-wide">{title}</h3>
        <div className="flex gap-2">{actions}</div>
      </header>
      {children}
    </section>
  );
}

export default Panel; // optionaler Default-Export für flexible Imports
