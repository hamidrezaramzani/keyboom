import { Module } from '@nestjs/common';
import { WorkspaceModule } from '../workspace/workspace.module';
import { NotificationModule } from '../notification/notification.module';
import { UsersModule } from '../user/user.module';
import { InvitationController } from './invite.controller';
import { InvitationRepository } from './invite.repository';
import { InvitationService } from './invite.service';
import { SanityCheckModule } from '../sanity-check/sanity-check.module';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    WorkspaceModule,
    UsersModule,
    NotificationModule,
    SanityCheckModule,
    WebSocketModule,
  ],
  controllers: [InvitationController],
  providers: [InvitationService, InvitationRepository],
  exports: [InvitationService],
})
export class InvitationModule {}
