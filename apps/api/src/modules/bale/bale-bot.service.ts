import { Injectable, Logger } from '@nestjs/common';
import { BaleService as BaleApiService } from '../bale/bale.service';
import { BaleHelper, BaleMessage } from 'src/core/helpers/bale.helper';
import { UsersRepository } from '../user/user.repository';
import { getFaMoment } from '../subscription/subscription.utils';

@Injectable()
export class BaleBotService {
  private readonly logger = new Logger(BaleBotService.name);
  private tempUserIds: Map<string, string> = new Map();

  constructor(
    private readonly baleHelper: BaleHelper,
    private readonly baleApiService: BaleApiService,
    private readonly userRepository: UsersRepository,
  ) {}

  async processBaleRequest(body: BaleMessage) {
    try {
      if (body.message?.text) {
        const message = body.message.text.trim();
        const chatId = body.message.from.id;
        const baleChatId = chatId.toString();

        await this.handleMessage(chatId, baleChatId, message);
        return;
      }

      if (body.callback_query) {
        const callbackData = body.callback_query.data;
        const chatId = body.callback_query.from.id;
        const baleChatId = chatId.toString();
        const callbackQueryId = body.callback_query.id;

        await this.handleCallback(
          chatId,
          baleChatId,
          callbackData,
          callbackQueryId,
        );
        return;
      }
    } catch (error) {
      this.logger.error(`Error processing request: ${error}`);
    }
  }

  private async handleMessage(
    chatId: number,
    baleChatId: string,
    message: string,
  ) {
    if (message === '/start') {
      await this.baleHelper.sendAuthButton(
        chatId,
        `👋 به ربات مدیریت اشتراک کی بوم خوش آمدید!`,
      );
    } else if (message === '/help') {
      await this.sendHelpMessage(chatId);
    } else if (message.startsWith('/id')) {
      const parts = message.split(' ');
      const userId = parts[1];
      if (userId) {
        this.tempUserIds.set(baleChatId, userId);
        await this.baleHelper.sendMessage(
          chatId,
          `✅ شناسه شما ثبت شد.\n\nاکنون به پنل کاربری بروید و روی دکمه "اتصال به ربات" کلیک کنید.`,
        );
      } else {
        await this.baleHelper.sendMessage(
          chatId,
          `❌ لطفاً شناسه کاربری خود را وارد کنید.\nمثال: /id 123456789`,
        );
      }
    } else if (message.startsWith('/code')) {
      const user = await this.userRepository.findByBaleChatId(String(chatId));
      if (user) {
        if (!user.baleConnectedAt) return;
        await this.baleHelper.sendMessage(
          chatId,
          `✅ احراز هویت شما تایید شده است. \n زمان احراز هویت انجام شده: ${getFaMoment(user.baleConnectedAt).format('jYYYY/jMM/jDD - HH:mm')}`,
        );
        return;
      }
      const parts = message.split(' ');
      const code = parts[1];
      if (code) {
        await this.handleCode(chatId, baleChatId, code);
      } else {
        await this.baleHelper.sendMessage(
          chatId,
          `❌ لطفاً کد را وارد کنید.\nمثال: /code 123456`,
        );
      }
    } else {
      await this.baleHelper.sendMessage(
        chatId,
        `❌ دستور نامعتبر!\n\nبرای راهنمایی /help را ارسال کنید.`,
      );
    }
  }

  private async handleCallback(
    chatId: number,
    baleChatId: string,
    callbackData: string,
    callbackQueryId: string,
  ) {
    await this.baleHelper.answerCallback(callbackQueryId);

    if (callbackData === 'help') {
      await this.sendHelpMessage(chatId);
    } else {
      await this.baleHelper.sendMessage(
        chatId,
        `❌ دستور نامعتبر!\n\nبرای راهنمایی /help را ارسال کنید.`,
      );
    }
  }

  private async handleCode(chatId: number, baleChatId: string, code: string) {
    try {
      const result = await this.baleApiService.connectBale(baleChatId, code);

      if (result.success) {
        await this.baleHelper.sendMessage(
          chatId,
          `✅ اتصال شما با موفقیت انجام شد!\n\nاکنون می‌توانید نوتیفیکیشن‌های خود را دریافت کنید.`,
        );
        this.tempUserIds.delete(baleChatId);
      } else {
        await this.baleHelper.sendMessage(chatId, `❌ ${result.message}`);
      }
    } catch (error) {
      this.logger.error(`Error verifying code: ${error}`);
      await this.baleHelper.sendMessage(
        chatId,
        `❌ کد نامعتبر یا منقضی شده است. لطفاً دوباره تلاش کنید.`,
      );
    }
  }

  private async sendHelpMessage(chatId: number) {
    const helpMessage = `
📖 **راهنمای ربات مدیریت اشتراک**

🔹 **دستورات موجود:**
/start - شروع مجدد ربات
/help - نمایش این راهنما
/code [کد] - تأیید کد اتصال

❓ سوالی دارید؟ با پشتیبانی تماس بگیرید.
    `;
    await this.baleHelper.sendMessage(chatId, helpMessage);
  }
}
