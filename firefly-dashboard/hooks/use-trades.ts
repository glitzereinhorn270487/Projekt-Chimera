
import useSWR from 'swr';

// Define the structure of our trade data based on the dummy API
export interface Trade {
  id: string;
  tokenSymbol: string;
  tokenAddress: string;
  amount: number;
  entryPrice: number;
  currentPrice?: number; // Only for open trades
  exitPrice?: number; // Only for closed trades
  pnl: number;
  pnlPercentage: number;
  timestamp?: number; // Open trade entry time
  entryTimestamp?: number; // Closed trade entry time
  exitTimestamp?: number; // Closed trade exit time
}

export interface TradesData {
  open: Trade[];
  closed: Trade[];
}

// The fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTrades() {
  const { data, error, isLoading } = useSWR<TradesData>('/api/trades', fetcher, {
    // Optional: Refresh data every 30 seconds
    refreshInterval: 30000,
  });

  return {
    trades: data,
    isLoading,
    isError: error,
  };
}
