import { forwardRef, Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import { UsersModule } from '../user/user.module';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, NotificationGateway],
  exports: [NotificationService],
})
export class NotificationModule {}
