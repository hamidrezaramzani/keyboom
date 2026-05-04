import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from './workspace.guard';

@WebSocketGateway({
  namespace: 'workspace',
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
@UseGuards(WsJwtGuard)
export class WorkspaceGateway
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
      console.log(`🔌 Workspace Gateway: User ${userId} connected`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketUsers.get(client.id);
    if (userId) {
      this.userSockets.delete(userId);
      this.socketUsers.delete(client.id);
      console.log(`🔌 Workspace Gateway: User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('workspace:join')
  async handleJoinWorkspace(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { workspaceId: string; userId: string },
  ) {
    const userId = client.data.userId;
    const previousWorkspace = client.data.workspaceId;

    if (previousWorkspace) {
      await client.leave(`workspace:${previousWorkspace}`);
    }

    await client.join(`workspace:${data.workspaceId}`);
    client.data.workspaceId = data.workspaceId;

    console.log(`User ${userId} joined workspace:${data.workspaceId}`);

    return {
      event: 'workspace:joined',
      data: { workspaceId: data.workspaceId },
    };
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

  emitWorkspaceCreated(workspaceId: string, workspace: any) {
    this.emitToWorkspace(workspaceId, 'workspace:created', { workspace });
  }

  emitWorkspaceUpdated(workspaceId: string, workspace: any, updatedBy: string) {
    this.emitToWorkspace(workspaceId, 'workspace:updated', {
      workspace,
      updatedBy,
      timestamp: new Date(),
    });
  }

  emitWorkspaceDeleted(workspaceId: string, deletedBy: string) {
    this.emitToWorkspace(workspaceId, 'workspace:deleted', {
      workspaceId,
      deletedBy,
      timestamp: new Date(),
    });
  }

  emitMemberJoined(workspaceId: string, member: any) {
    this.emitToWorkspace(workspaceId, 'member:joined', { member });
  }

  emitMemberLeft(workspaceId: string, userId: string) {
    this.emitToWorkspace(workspaceId, 'member:left', { userId });
  }
}
