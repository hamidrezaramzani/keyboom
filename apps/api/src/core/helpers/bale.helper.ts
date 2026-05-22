/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';

export interface BaleMessage {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name?: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
      title?: string;
      username?: string;
    };
    date: number;
    text?: string;
  };
  callback_query?: {
    id: string;
    from: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
    };
    message: {
      message_id: number;
      chat: {
        id: number;
        type: string;
      };
      date: number;
    };
    data: string;
  };
}

export type ChatAction =
  | 'typing'
  | 'upload_photo'
  | 'record_video'
  | 'upload_video'
  | 'record_voice'
  | 'upload_voice'
  | 'choose_sticker';

@Injectable()
export class BaleHelper {
  private readonly logger = new Logger(BaleHelper.name);
  private readonly baseUrl: string;

  constructor() {
    const token = process.env.BALE_TOKEN;
    if (!token) {
      throw new Error('❌ BALE_TOKEN is not defined in .env file');
    }
    this.baseUrl = `https://tapi.bale.ai/bot${token}`;
    this.logger.log('✅ BaleHelper initialized');
  }

  async sendMessage(
    chatId: number | string | undefined,
    text: string,
    parseMode?: string,
  ): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: parseMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.logger.error(`Bale API error: ${JSON.stringify(data)}`);
        throw new Error(data.description || 'Failed to send message');
      }

      this.logger.log(`✅ Message sent to ${chatId}`);
      return data;
    } catch (error) {
      this.logger.error(`❌ Failed to send message: ${error.message}`);
      throw error;
    }
  }

  async sendChatAction(
    chatId: number | string,
    action: ChatAction,
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/sendChatAction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          action: action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.logger.error(
          `Bale API error (sendChatAction): ${JSON.stringify(data)}`,
        );
        return false;
      }

      this.logger.log(`✅ Chat action "${action}" sent to ${chatId}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to send chat action: ${error.message}`);
      return false;
    }
  }

  async sendTypingAction(chatId: number | string): Promise<boolean> {
    return this.sendChatAction(chatId, 'typing');
  }

  async sendUploadPhotoAction(chatId: number | string): Promise<boolean> {
    return this.sendChatAction(chatId, 'upload_photo');
  }

  async sendRecordVideoAction(chatId: number | string): Promise<boolean> {
    return this.sendChatAction(chatId, 'record_video');
  }

  async sendUploadVideoAction(chatId: number | string): Promise<boolean> {
    return this.sendChatAction(chatId, 'upload_video');
  }

  async sendRecordVoiceAction(chatId: number | string): Promise<boolean> {
    return this.sendChatAction(chatId, 'record_voice');
  }

  async sendUploadVoiceAction(chatId: number | string): Promise<boolean> {
    return this.sendChatAction(chatId, 'upload_voice');
  }

  async sendChooseStickerAction(chatId: number | string): Promise<boolean> {
    return this.sendChatAction(chatId, 'choose_sticker');
  }

  async getMe(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/getMe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.ok) {
        this.logger.log(`🤖 Bot: @${data.result.username}`);
      }

      return data;
    } catch (error) {
      this.logger.error(`❌ Failed to get bot info: ${error.message}`);
      throw error;
    }
  }

  async setWebhook(url: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
        }),
      });

      const data = await response.json();

      if (data.ok) {
        this.logger.log(`🔗 Webhook set to: ${url}`);
      } else {
        this.logger.error(`Failed to set webhook: ${data.description}`);
      }

      return data;
    } catch (error) {
      this.logger.error(`❌ Failed to set webhook: ${error.message}`);
      throw error;
    }
  }

  async getWebhookInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/getWebhookInfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      this.logger.log(`📡 Webhook info: ${JSON.stringify(data.result)}`);
      return data;
    } catch (error) {
      this.logger.error(`❌ Failed to get webhook info: ${error.message}`);
      throw error;
    }
  }

  async sendInlineKeyboard(
    chatId: number | string,
    text: string,
    buttons: Array<Array<{ text: string; callback_data: string }>>,
  ): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          reply_markup: {
            inline_keyboard: buttons,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.description || 'Failed to send inline keyboard');
      }

      this.logger.log(`✅ Inline keyboard sent to ${chatId}`);
      return data;
    } catch (error) {
      this.logger.error(`❌ Failed to send inline keyboard: ${error.message}`);
      throw error;
    }
  }

  async answerCallback(callbackQueryId: string, text?: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/answerCallbackQuery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callback_query_id: callbackQueryId,
          text: text || '✅ دریافت شد',
          show_alert: false,
        }),
      });

      const data = await response.json();
      this.logger.log(`✅ Callback answered: ${callbackQueryId}`);
      return data;
    } catch (error) {
      this.logger.error(`❌ Failed to answer callback: ${error.message}`);
      throw error;
    }
  }

  async sendAuthButton(chatId: number | string, text: string): Promise<any> {
    try {
      const inlineKeyboard = {
        inline_keyboard: [
          [
            {
              text: '📖 راهنما',
              callback_data: 'help',
            },
          ],
        ],
      };

      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          reply_markup: inlineKeyboard,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.logger.error(`Bale API error: ${JSON.stringify(data)}`);
        throw new Error(
          data.description || 'Failed to send message with button',
        );
      }

      this.logger.log(`✅ Auth button sent to ${chatId}`);
      return data;
    } catch (error) {
      this.logger.error(`❌ Failed to send auth button: ${error.message}`);
      throw error;
    }
  }
}
