
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
    .default(true),

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
 * Parse the environment variables against the schema.
 * This will throw an error if the environment variables are invalid.
 */
export const config = configSchema.parse(process.env);
