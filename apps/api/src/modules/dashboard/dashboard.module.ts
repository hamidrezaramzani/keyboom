import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardRepository } from './dashboard.repository';
import { SubscriptionModule } from '../subscription/subscription.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { GroupModule } from '../group/group.module';
import { SanityCheckModule } from '../sanity-check/sanity-check.module';
import { CategoriesModule } from '../category/category.module';

@Module({
  controllers: [DashboardController],
  imports: [
    SubscriptionModule,
    WorkspaceModule,
    GroupModule,
    SanityCheckModule,
    CategoriesModule,
  ],
  providers: [DashboardService, DashboardRepository],
})
export class DashboardModule {}
