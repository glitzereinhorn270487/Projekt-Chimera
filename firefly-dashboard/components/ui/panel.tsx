import * as React from "react";

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
    <section
      className={
        "glass glow-cyan p-6 md:p-8 rounded-3xl " + (className ?? "")
      }
    >
      {(title || actions) && (
        <header className="flex items-center justify-between mb-4">
          {title ? (
            <h3 className="text-sky-100/90 tracking-wide">{title}</h3>
          ) : (
            <span />
          )}
          <div className="flex gap-2">{actions}</div>
        </header>
      )}
      {children}
    </section>
  );
}
export default Panel;
