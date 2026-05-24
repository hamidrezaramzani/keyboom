import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SubscriptionRepository } from '../subscription/subscription.repository';
import { NotificationService } from '../notification/notification.service';
import { UsersRepository } from '../user/user.repository';
import { getFaMoment } from '../subscription/subscription.utils';
import { generateId } from 'src/core/helpers/generate-id';

@Injectable()
export class ReminderCron {
  private readonly logger = new Logger(ReminderCron.name);
  private sentToday = new Set<string>();

  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly notificationService: NotificationService,
    private readonly userRepository: UsersRepository,
  ) {}

  @Cron('0 8 * * *')
  async checkExpiringSubscriptions() {
    this.logger.log('🔍 Checking subscriptions that need reminder...');

    this.sentToday.clear();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiringSubs =
      await this.subscriptionRepository.findSubscriptionsNeedingReminder(today);

    for (const sub of expiringSubs) {
      try {
        if (this.sentToday.has(sub.id)) {
          this.logger.debug(`⏭️ Already sent today for ${sub.name}`);
          continue;
        }

        const user = await this.userRepository.findById(sub.userId);
        if (!user) {
          this.logger.warn(`User not found for subscription ${sub.id}`);
          continue;
        }

        const daysLeft = Math.ceil(
          (sub.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        const jalaliEndDate = getFaMoment(sub.endDate).format('jYYYY/jMM/jDD');

        const message = this.buildReminderMessage(
          sub.name,
          jalaliEndDate,
          daysLeft,
        );
        const title = `⏰ یادآوری تمدید اشتراک: ${sub.name}`;

        await this.notificationService.create({
          id: generateId(),
          userId: sub.userId,
          type: 'reminder',
          title: title,
          message: message,
          isRead: false,
          metadata: JSON.stringify({
            subscriptionId: sub.id,
            daysLeft,
            endDate: sub.endDate.toISOString(),
            subscriptionName: sub.name,
            price: sub.price,
          }),
        });

        this.sentToday.add(sub.id);

        this.logger.log(
          `✅ Reminder sent for: ${sub.name} (${daysLeft} days left)`,
        );
      } catch (error) {
        this.logger.error(
          `❌ Failed to send reminder for subscription ${sub.id}: ${error}`,
        );
      }
    }
  }

  private buildReminderMessage(
    subscriptionName: string,
    endDate: string,
    daysLeft: number,
  ): string {
    const emoji = daysLeft <= 3 ? '⚠️' : '📌';
    const urgencyText =
      daysLeft <= 3
        ? '❗️ زمان باقی‌مانده بسیار کم است! لطفاً سریعاً اقدام کنید.'
        : 'لطفاً نسبت به تمدید آن اقدام کنید.';

    return `${emoji} **یادآوری تمدید اشتراک**

📱 **نام اشتراک:** ${subscriptionName}
📅 **تاریخ پایان:** ${endDate}
⏳ **روزهای باقی‌مانده:** ${daysLeft} روز

${urgencyText}

برای مدیریت اشتراک‌های خود به پنل کاربری مراجعه کنید.`;
  }
}
