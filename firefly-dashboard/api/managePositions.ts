
import { Connection } from '@solana/web3.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { config } from '@/config';
import { getAllTrades, deleteTrade, Trade } from '../lib/database';
import { sendTelegramMessage } from '../lib/telegram';

const connection = new Connection(config.QUICKNODE_RPC_URL);

// --- Mock Position Management Logic ---
const PROFIT_TARGET = 1.5; // 50% profit
const STOP_LOSS = 0.8; // 20% loss

async function shouldSell(trade: Trade): Promise<boolean> {
  // Simulate fetching the current price
  const currentPrice = trade.price * (Math.random() * (PROFIT_TARGET + 0.2 - STOP_LOSS) + STOP_LOSS);
  console.log(`Current price for ${trade.token} is $${currentPrice.toFixed(2)} (buy price: $${trade.price})`);

  // Sell if profit target or stop loss is hit
  return currentPrice >= trade.price * PROFIT_TARGET || currentPrice <= trade.price * STOP_LOSS;
}

async function manageCurrentPositions() {
  console.log('Managing open positions...');

  if (config.PAPER_TRADING_MODE) {
    const openTrades = await getAllTrades();

    for (const trade of openTrades) {
      if (await shouldSell(trade)) {
        console.log(`Paper trading: Simulating sell for ${trade.token}`);

        // In paper mode, we just remove the trade from our records
        await deleteTrade(trade.id);

        await sendTelegramMessage(
          `*PAPER TRADE (SELL)*\nToken: \`${trade.token}\`\nOriginal Amount: ${trade.amount} SOL\nOriginal Price: $${trade.price}`
        );
      }
    }
  }

  console.log('Position management complete.');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      await manageCurrentPositions();
      res.status(200).json({ message: 'Position management completed successfully.' });
    } catch (error) {
      console.error('Error during position management:', error);
      res.status(500).json({ error: 'Internal ServerError' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
