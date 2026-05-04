import { Module } from '@nestjs/common';
import { WorkspaceModule } from '../workspace/workspace.module';
import { NotificationModule } from '../notification/notification.module';
import { UsersModule } from '../user/user.module';
import { InvitationController } from './invite.controller';
import { InvitationRepository } from './invite.repository';
import { InvitationService } from './invite.service';

@Module({
  imports: [WorkspaceModule, UsersModule, NotificationModule],
  controllers: [InvitationController],
  providers: [InvitationService, InvitationRepository],
  exports: [InvitationService],
})
export class InvitationModule {}
