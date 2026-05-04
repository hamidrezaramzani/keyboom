/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  WebSocketGateway as WebSocketGateway2,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import cookie from 'cookie';

@WebSocketGateway2({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/',
})
export class WebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string[]> = new Map();
  afterInit(server: Server) {
    server.use((socket: Socket, next) => {
      let token = null;

      if (socket.handshake.headers.cookie) {
        const cookies = cookie.parse(socket.handshake.headers.cookie);
        token = cookies['ACCESS_TOKEN'] || cookies['access_token'];
      }

      if (!token) {
        console.error('❌ No token in middleware');
        next(new Error('Authentication error'));
        return;
      }

      try {
        const payload = verify(token, process.env.JWT_SECRET!) as {
          sub: string;
        };
        socket.data.userId = payload.sub;
        next();
      } catch (error) {
        console.error(
          '❌ Token verification failed in middleware:',
          error.message,
        );
        next(new Error('Authentication error'));
      }
    });
  }

  handleConnection(client: Socket) {
    const userId = client.data.userId as string;

    if (!userId) {
      client.disconnect();
      return;
    }

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, []);
    }
    this.userSockets.get(userId)!.push(client.id);
    console.log(`✅ Connected: `, client.id);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔴 Disconnect: ${client.id}`);
    const userId = client.data.userId as string;
    if (userId && this.userSockets.has(userId)) {
      const sockets = this.userSockets.get(userId)!;
      const index = sockets.indexOf(client.id);
      if (index !== -1) sockets.splice(index, 1);
      if (sockets.length === 0) this.userSockets.delete(userId);
    }
  }

  @SubscribeMessage('workspace:join')
  async handleJoinWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { workspaceId: string },
  ) {
    const previousWorkspace = client.data.workspaceId as string;
    if (previousWorkspace) {
      await client.leave(`workspace:${previousWorkspace}`);
    }
    await client.join(`workspace:${data.workspaceId}`);
    client.data.workspaceId = data.workspaceId;
    return {
      event: 'workspace:joined',
      data: { workspaceId: data.workspaceId },
    };
  }

  emitToWorkspace(workspaceId: string, event: string, data: any) {
    this.server.to(`workspace:${workspaceId}`).emit(event, data);
  }

  emitToUser(userId: string, event: string, data: any) {
    const sockets = this.userSockets.get(userId);

    if (!sockets || sockets.length === 0) {
      return;
    }

    void this.server.fetchSockets().then((allSockets) => {
      sockets.forEach((socketId) => {
        const socket = allSockets.find((s) => s.id === socketId);
        if (socket) {
          socket.emit(event, data);
        }
      });
    });
  }

  sendNotification(userId: string, notification: any) {
    this.emitToUser(userId, 'notification:created', {
      ...notification,
      timestamp: new Date(),
    });
  }
}
