export const fmtUsd = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
  
  export const fmtPct = (n: number) =>
    `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
  
  export const badge = (n: number) =>
    n > 75 ? "bg-emerald-500/20 text-emerald-300" :
    n > 50 ? "bg-yellow-500/20 text-yellow-300" :
             "bg-red-500/20 text-red-300";
  