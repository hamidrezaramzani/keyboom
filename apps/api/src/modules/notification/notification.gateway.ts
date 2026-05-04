import {
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../workspace/workspace.guard';
import { Notification } from './notification.schema';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/',
})
@UseGuards(WsJwtGuard)
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>();
  private socketUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.userSockets.set(userId, client.id);
      this.socketUsers.set(client.id, userId);
      console.log(`🔌 WebSocket: User ${userId} connected`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketUsers.get(client.id);
    if (userId) {
      this.userSockets.delete(userId);
      this.socketUsers.delete(client.id);
      console.log(`🔌 WebSocket: User ${userId} disconnected`);
    }
  }

  emitToWorkspace(workspaceId: string, event: string, data: any) {
    this.server.to(`workspace:${workspaceId}`).emit(event, data);
  }

  emitToUser(userId: string, event: string, data: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }

  emitNotification(userId: string, notification: Notification) {
    this.emitToUser(userId, 'notification:new', { notification });
  }

  emitNotificationRead(userId: string, notificationId: string) {
    this.emitToUser(userId, 'notification:read', { notificationId });
  }

  emitAllNotificationsRead(userId: string) {
    this.emitToUser(userId, 'notification:all-read', {});
  }
}
