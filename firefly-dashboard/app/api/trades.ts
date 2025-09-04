
import type { VercelRequest, VercelResponse } from '@vercel/node';

// This is a dummy data source. In a real application, you would fetch this from your database.
const DUMMY_TRADES = {
  open: [
    {
      id: 'a1b2c3d4',
      tokenSymbol: 'FIRE',
      tokenAddress: 'F1rEZq17e3x1L3c8c7f7e9b3d5a7c9b1d3a5e7c9',
      amount: 1.5, // e.g., in SOL
      entryPrice: 150.75,
      currentPrice: 180.25,
      pnl: 44.25,
      pnlPercentage: 29.35,
      timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    },
    {
      id: 'e5f6g7h8',
      tokenSymbol: 'FLY',
      tokenAddress: 'FLyq17e3x1L3c8c7f7e9b3d5a7c9b1d3a5e7c9d',
      amount: 0.8,
      entryPrice: 95.5,
      currentPrice: 85.2,
      pnl: -8.24,
      pnlPercentage: -10.8,
      timestamp: Date.now() - 5 * 60 * 60 * 1000, // 5 hours ago
    },
  ],
  closed: [
    {
      id: 'i9j0k1l2',
      tokenSymbol: 'WIF',
      tokenAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzL7gmAJsR2eLP',
      amount: 2.1,
      entryPrice: 2.5,
      exitPrice: 4.1,
      pnl: 3.36,
      pnlPercentage: 64.0,
      entryTimestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
      exitTimestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    },
    {
      id: 'm3n4o5p6',
      tokenSymbol: 'BONK',
      tokenAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      amount: 1.0,
      entryPrice: 0.000025,
      exitPrice: 0.000035,
      pnl: 1000000,
      pnlPercentage: 40.0,
      entryTimestamp: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4 days ago
      exitTimestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    },
  ],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // In a real app, you'd fetch and process data from lib/database here.
    // For now, we return a static mock.
    res.status(200).json(DUMMY_TRADES);
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
