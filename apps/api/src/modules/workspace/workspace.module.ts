import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceRepository } from './workspace.repository';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { UsersModule } from '../user/user.module';
import { SanityCheckModule } from '../sanity-check/sanity-check.module';
import { NotificationModule } from '../notification/notification.module';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    forwardRef(() => SanityCheckModule),
    forwardRef(() => UsersModule),
    NotificationModule,
    WebSocketModule,
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceRepository, WorkspaceService],
  exports: [WorkspaceRepository],
})
export class WorkspaceModule {}
