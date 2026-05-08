import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceModule } from '../workspace/workspace.module';
import { SanityCheckService } from './sanity-check.service';
import { UsersModule } from '../user/user.module';
import { GroupModule } from '../group/group.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    forwardRef(() => WorkspaceModule),
    forwardRef(() => UsersModule),
    forwardRef(() => GroupModule),
    forwardRef(() => SubscriptionModule),
  ],
  providers: [SanityCheckService],
  exports: [SanityCheckService],
})
export class SanityCheckModule {}
