
import { z } from "zod";

/**
 * Define the schema for the environment variables.
 * This provides validation and type safety.
 */
const configSchema = z.object({
  // Trading Bot Settings
  PAPER_TRADING_MODE: z
    .string()
    .transform((val) => val === "true")
    .default("true"),

  // Solana Settings
  SOLANA_RPC_URL: z.string().url().default("https://api.mainnet-beta.solana.com"),

  // Policies & Thresholds
  MAX_TRANSACTION_RETRIES: z.coerce.number().int().positive().default(3),
  SLIPPAGE_PERCENTAGE: z.coerce.number().positive().default(0.5),

  // API Keys & Secrets (should be kept in .env.local)
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  REDIS_URL: z.string().optional(),
});

/**
 * Parse and validate the environment variables.
 * NEXT_PUBLIC_ variables are exposed to the browser.
 */
const config = configSchema.parse({
  PAPER_TRADING_MODE: process.env.NEXT_PUBLIC_PAPER_TRADING_MODE,
  SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
  MAX_TRANSACTION_RETRIES: process.env.NEXT_PUBLIC_MAX_TRANSACTION_RETRIES,
  SLIPPAGE_PERCENTAGE: process.env.NEXT_PUBLIC_SLIPPAGE_PERCENTAGE,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  REDIS_URL: process.env.REDIS_URL,
});

export default config;
