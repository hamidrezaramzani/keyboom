import { Module } from '@nestjs/common';
import { SubscriptionPeriodController } from './subscription-period.controller';
import { SubscriptionPeriodService } from './subscription-period.service';
import { SubscriptionPeriodRepository } from './subscription-period.repository';
import { SubscriptionModule } from '../subscription/subscription.module';
import { GroupModule } from '../group/group.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { SanityCheckModule } from '../sanity-check/sanity-check.module';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    SubscriptionModule,
    GroupModule,
    WorkspaceModule,
    SanityCheckModule,
    WebSocketModule,
  ],
  controllers: [SubscriptionPeriodController],
  providers: [SubscriptionPeriodService, SubscriptionPeriodRepository],
  exports: [SubscriptionPeriodService, SubscriptionPeriodRepository],
})
export class SubscriptionPeriodModule {}
