// firefly-dashboard/src/components/TradeDetailView.tsx
import type { TradeDetail } from "@/types/trade";
import { formatCurrency, formatPct, compactNumber } from "@/lib/format";

export function TradeDetailView({ detail }: { detail: TradeDetail }) {
  return (
    <div className="space-y-4">
      {/* ... deine bestehende Struktur ... */}

      <div>
        <h4 className="font-medium mb-2">Top Wallets</h4>
        <ul className="space-y-1">
          {detail.topWallets.map(
            (w: { address: string; concentrationPct: number }) => (
              <li key={w.address} className="flex justify-between">
                <span className="truncate">{w.address}</span>
                <span>{formatPct(w.concentrationPct)}</span>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
