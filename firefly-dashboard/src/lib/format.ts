// firefly-dashboard/src/lib/format.ts
export function formatCurrency(
  v: number,
  currency: string = "USD",
  maximumFractionDigits = 2
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(v ?? 0);
}

export function compactNumber(v: number, maximumFractionDigits = 1): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits,
  }).format(v ?? 0);
}

export function formatPct(v: number, digits = 2): string {
  const sign = v > 0 ? "+" : v < 0 ? "" : "";
  return `${sign}${(v ?? 0).toFixed(digits)}%`;
}

export function pnlClass(v: number): string {
  return v > 0 ? "text-emerald-400" : v < 0 ? "text-rose-400" : "text-zinc-300";
}
