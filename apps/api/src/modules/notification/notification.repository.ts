import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, desc, eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/core/db/drizzle.provider';
import {
  notifications,
  NewNotification,
  Notification,
} from './notification.schema';

@Injectable()
export class NotificationRepository {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<any>) {}

  async create(data: NewNotification): Promise<Notification> {
    const result = await this.db.insert(notifications).values(data).returning();
    return result[0];
  }

  async findByUserId(
    userId: string,
    limit: number = 20,
  ): Promise<Notification[]> {
    return this.db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  async findRecentByUserId(
    userId: string,
    limit: number = 3,
  ): Promise<Notification[]> {
    return this.db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  async markAsRead(id: string): Promise<Notification | undefined> {
    const result = await this.db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.id, id))
      .returning();
    return result[0];
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(
        and(eq(notifications.userId, userId), eq(notifications.isRead, false)),
      );
  }

  async getUnreadCount(userId: string): Promise<number> {
    const result = await this.db
      .select({ count: this.db.$count(notifications) })
      .from(notifications)
      .where(
        and(eq(notifications.userId, userId), eq(notifications.isRead, false)),
      );

    return result[0]?.count || 0;
  }
}
