import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { NewNotification, Notification } from './notification.schema';
import { WebSocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepo: NotificationRepository,
    private readonly websocketGateway: WebSocketGateway,
  ) {}

  async create(data: NewNotification): Promise<Notification> {
    const notification = await this.notificationRepo.create(data);

    this.websocketGateway.emitToUser(data.userId, 'notification:new', {
      notification,
    });

    return notification;
  }

  async getUserNotifications(
    userId: string,
    limit?: number,
  ): Promise<Notification[]> {
    return this.notificationRepo.findByUserId(userId, limit);
  }

  async getRecentNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepo.findRecentByUserId(userId, 3);
  }

  async markAsRead(
    userId: string,
    notificationId: string,
  ): Promise<Notification | undefined> {
    const notification = await this.notificationRepo.markAsRead(notificationId);

    if (notification) {
      this.websocketGateway.emitToUser(userId, 'notification:read', {
        notificationId,
      });
    }

    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepo.markAllAsRead(userId);
    this.websocketGateway.emitToUser(userId, 'notification:all-read', {});
  }

  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.notificationRepo.getUnreadCount(userId);
    return { count };
  }
}
