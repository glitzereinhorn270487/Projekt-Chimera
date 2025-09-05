import { Trade } from "@/types/trade";

type Store = {
  engineRunning: boolean;
  open: Trade[];
  closed: Trade[];
};

export let store: Store = {
  engineRunning: false,
  open: [
    // Beispiel-Dummy; kann leer bleiben
  ],
  closed: [],
};

export function getStore() { return store; }
export function setEngineRunning(running: boolean) { store.engineRunning = running; }

export function addTrade(t: Trade) { store.open.push(t); }

export function closeTrade(id: string) {
  const idx = store.open.findIndex(t => t.id === id);
  if (idx === -1) return false;
  const t = store.open[idx];
  store.open.splice(idx, 1);
  store.closed.unshift(t);
  return true;
}
