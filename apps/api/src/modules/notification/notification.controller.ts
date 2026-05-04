import { Controller, Get, Patch, Param, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../../core/guards/auth.guard';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getAll(@Req() req: Request) {
    const userId = req.userId!;
    const notifications =
      await this.notificationService.getUserNotifications(userId);
    return { data: notifications, success: true };
  }

  @Get('recent')
  async getRecent(@Req() req: Request) {
    const userId = req.userId!;
    const notifications =
      await this.notificationService.getRecentNotifications(userId);
    return { data: notifications, success: true };
  }

  @Get('unread/count')
  async getUnreadCount(@Req() req: Request) {
    const userId = req.userId!;
    const count = await this.notificationService.getUnreadCount(userId);
    return { data: count, success: true };
  }

  @Patch(':id/read')
  async markAsRead(@Req() req: Request, @Param('id') id: string) {
    const userId = req.userId!;
    const notification = await this.notificationService.markAsRead(userId, id);
    return { data: notification, success: true };
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req: Request) {
    const userId = req.userId!;
    await this.notificationService.markAllAsRead(userId);
    return { success: true, message: 'All notifications marked as read' };
  }
}
