export function formatCurrency(
  n: number | null | undefined,
  currency: "USD" | "EUR" = "USD"
) {
  if (typeof n !== "number" || !isFinite(n)) return "–";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatPct(x: number | null | undefined) {
  if (typeof x !== "number" || !isFinite(x)) return "–";
  return `${x >= 0 ? "+" : ""}${x.toFixed(2)}%`;
}
