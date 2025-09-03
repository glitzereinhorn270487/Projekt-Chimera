
import { Redis } from '@upstash/redis';
import { v4 as uuidv4 } from 'uuid';
import config from './config';

if (!config.REDIS_URL) {
  throw new Error('REDIS_URL is not defined in the environment variables');
}

const redis = new Redis({
  url: config.REDIS_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '', // Usually, the token is part of the URL
});

// Key for the token queue in Redis
const TOKEN_QUEUE_KEY = 'token_queue';

/**
 * Adds a token to the processing queue.
 * @param token - The token symbol or address to add to the queue.
 * @returns The new length of the queue.
 */
export const addTokenToQueue = async (token: string): Promise<number> => {
  return await redis.rpush(TOKEN_QUEUE_KEY, token);
};

/**
 * Retrieves and removes the next token from the queue.
 * @returns The token symbol or address, or null if the queue is empty.
 */
export const getNextTokenFromQueue = async (): Promise<string | null> => {
  return await redis.lpop(TOKEN_QUEUE_KEY);
};

// Prefix for storing trade data in Redis
const TRADE_PREFIX = 'trade:';

export interface Trade {
  id: string;
  token: string;
  amount: number;
  price: number;
  timestamp: number;
}

/**
 * Saves a simulated trade to Redis.
 * @param trade - The trade data to save. The ID will be auto-generated.
 * @returns The full trade object, including its new ID.
 */
export const saveTrade = async (trade: Omit<Trade, 'id' | 'timestamp'>): Promise<Trade> => {
  const tradeId = uuidv4();
  const timestamp = Date.now();
  const tradeWithId: Trade = { ...trade, id: tradeId, timestamp };
  await redis.set(`${TRADE_PREFIX}${tradeId}`, JSON.stringify(tradeWithId));
  return tradeWithId;
};

/**
 * Retrieves a trade by its ID.
 * @param tradeId - The ID of the trade to retrieve.
 * @returns The trade object, or null if not found.
 */
export const getTradeById = async (tradeId: string): Promise<Trade | null> => {
  const tradeJson = await redis.get<string>(`${TRADE_PREFIX}${tradeId}`);
  if (tradeJson) {
    return JSON.parse(tradeJson) as Trade;
  }
  return null;
};

/**
 * Deletes a trade by its ID.
 * @param tradeId - The ID of the trade to delete.
 */
export const deleteTrade = async (tradeId: string): Promise<void> => {
  await redis.del(`${TRADE_PREFIX}${tradeId}`);
};

/**
 * Retrieves all trades.
 * Note: This can be inefficient for a large number of trades.
 * In a real-world scenario, you might want to implement pagination.
 * @returns An array of all trades.
 */
export const getAllTrades = async (): Promise<Trade[]> => {
  const tradeKeys = await redis.keys(`${TRADE_PREFIX}*`);
  if (tradeKeys.length === 0) {
    return [];
  }
  const tradesJson = await redis.mget<string[]>(...tradeKeys);
  return tradesJson.map((tradeJson) => JSON.parse(tradeJson) as Trade);
};
