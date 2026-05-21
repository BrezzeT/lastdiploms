interface TelegramRequestBody {
  chat_id: string;
  text: string;
  parse_mode: "HTML";
  reply_markup?: ReplyMarkup;
}
interface InlineKeyboardButton {
  text: string;
  url?: string;
}
interface ReplyMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}
export async function sendTelegramMessage(
  message: string,
  replyMarkup?: ReplyMarkup,
) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { success: false, error: "Телеграм токен або чат ID не знайдено" };
  }
  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const body: TelegramRequestBody = {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    };
    if (replyMarkup) {
      body.reply_markup = replyMarkup;
    }
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!data.ok) {
      return { success: false, error: data.description };
    }
    return { success: true };
  } catch (error) {
    console.error("Помилка надсилання повідомлення:", error);
    return { success: false, error: "Помилка надсилання повідомлення" };
  }
}
