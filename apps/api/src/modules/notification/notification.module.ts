import { forwardRef, Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import { UsersModule } from '../user/user.module';
import { WebSocketGateway } from '../websocket/websocket.gateway';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, WebSocketGateway],
  exports: [NotificationService],
})
export class NotificationModule {}
