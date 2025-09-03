
import { NextResponse } from 'next/server';

// Simulate a database or external API call
const getTrades = () => ({
  open: [
    {
      id: '1',
      tokenSymbol: 'SOL',
      tokenAddress: 'So11111111111111111111111111111111111111112',
      amount: 100,
      entryPrice: 150.25,
      currentPrice: 165.50,
      pnl: 1525,
      pnlPercentage: 10.15,
      timestamp: 1678886400,
    },
    {
        id: '2',
        tokenSymbol: 'ETH',
        tokenAddress: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKDswarUceUX',
        amount: 10,
        entryPrice: 3000,
        currentPrice: 2950,
        pnl: -500,
        pnlPercentage: -1.67,
        timestamp: 1678886400,
      }
  ],
  closed: [
    {
      id: '3',
      tokenSymbol: 'JUP',
      tokenAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
      amount: 5000,
      entryPrice: 1.10,
      exitPrice: 1.25,
      pnl: 750,
      pnlPercentage: 13.64,
      entryTimestamp: 1678882800,
      exitTimestamp: 1678886400,
    },
    {
        id: '4',
        tokenSymbol: 'WIF',
        tokenAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzL7MdbNjhwrgn',
        amount: 10000,
        entryPrice: 2.5,
        exitPrice: 2.0,
        pnl: -5000,
        pnlPercentage: -20.0,
        entryTimestamp: 1678882800,
        exitTimestamp: 1678886400,
      }
  ],
});

export async function GET() {
  try {
    const trades = getTrades();
    return NextResponse.json(trades);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
