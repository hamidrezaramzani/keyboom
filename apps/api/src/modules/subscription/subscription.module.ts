import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { GroupModule } from '../group/group.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { WebSocketModule } from '../websocket/websocket.module';
import { SanityCheckModule } from '../sanity-check/sanity-check.module';

@Module({
  imports: [
    GroupModule,
    forwardRef(() => WorkspaceModule),
    forwardRef(() => SanityCheckModule),
    WebSocketModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionRepository],
  exports: [SubscriptionService, SubscriptionRepository],
})
export class SubscriptionModule {}
