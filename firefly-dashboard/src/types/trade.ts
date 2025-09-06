// src/types/trade.ts

// --- Chains ---
export type Chain = "Solana" | "Ethereum" | "BSC" | "Polygon" | string;

// --- Tabellenzeile (Liste/Übersicht) ---
export interface TradeRow {
  id: string;
  chain: Chain;
  category: string;           // z.B. "Meme", "DeFi", …
  narrative: string;          // kurze Story/These
  scoreX: number;             // 0–100
  marketcap: number;          // USD
  volume24h: number;          // USD
  initialInvestment: number;  // USD
  entryPrice: number;         // USD (Entry)
  amount: number;             // Stück/Token
  pnlAbs: number;             // USD
  pnlPct: number;             // %
  tax: number;                // USD (oder % – je nach Modell)
  status: "open" | "closed";

  // optionale Metadaten
  symbol?: string;
  address?: string;
}


// Viele Stellen erwarten einen Typ „Trade“ – Alias auf TradeRow:
export type Trade = TradeRow;

// --- Detailansicht einer Position ---
export interface TradeDetail extends TradeRow {
  pumpDumpProb: number; // 0..1
  fomoScore: number;    // 0..100
  riskScore: number;    // 0..100
  telegramUrl?: string;
  dexScreenerUrl?: string;
  holders: number;
  tx: { buys: number; sells: number; total: number };
  topWallets: { address: string; concentrationPct: number }[]; // Top 3
}

// --- PnL-Kachel / Sparkline ---
export interface PnlSummary {
  pnlAbs: number;
  pnlPct: number;
  spark: number[];
}

// --- Capital-Kachel ---
export interface Capital {
  usd: number;
  sol: number;
}

// (optional) Live-Preise: z.B. { "SOL": { "USD": 155.2 } }
export type Prices = Record<string, Record<string, number | null>>;

export interface TradeRow {
  id: string;
  chain: Chain;
  category: string;
  narrative: string;
  scoreX: number;
  marketcap: number;
  volume24h: number;
  initialInvestment: number;
  entryPrice: number;
  amount: number;
  pnlAbs: number;
  pnlPct: number;
  tax: number;
  status: "open" | "closed";
  symbol?: string;
  address?: string;

  // ➕ neu (nur bei geschlossenen Positionen befüllt)
  closePrice?: number;
  closedAt?: string | null; // ISO Datum optional
}
