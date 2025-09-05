// firefly-dashboard/src/lib/format.ts
export function formatCurrency(v: number, currency: "USD" | "EUR" = "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(v ?? 0);
  }
  
  export function formatPct(v: number) {
    const sign = v > 0 ? "+" : v < 0 ? "–" : "";
    return `${sign}${Math.abs(v ?? 0).toFixed(2)}%`;
  }
  
  export function compactNumber(v: number) {
    return new Intl.NumberFormat("en", { notation: "compact" }).format(v ?? 0);
  }
  