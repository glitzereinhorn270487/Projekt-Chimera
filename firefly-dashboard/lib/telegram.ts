
import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config';

const token = config.TELEGRAM_BOT_TOKEN;

let bot: TelegramBot | null = null;
if (token) {
  bot = new TelegramBot(token);
}

// You need to get your chat ID. You can get it by sending a message to the bot and checking the API response.
// A simple way is to message your bot and then open this URL in your browser:
// https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
const CHAT_ID = config.TELEGRAM_CHAT_ID;

/**
 * Sends a message to a predefined Telegram chat.
 * @param message - The message text to send.
 */
export const sendTelegramMessage = async (message: string) => {
  if (bot && CHAT_ID) {
    try {
      await bot.sendMessage(CHAT_ID, message, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error sending Telegram message:', error);
    }
  } else {
    console.log(`Telegram bot not configured. Message: ${message}`);
  }
};
