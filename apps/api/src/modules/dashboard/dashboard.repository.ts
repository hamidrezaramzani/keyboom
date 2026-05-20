import { Inject, Injectable } from '@nestjs/common';
import { desc, eq, and, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/core/db/drizzle.provider';
import {
  subscriptionHistory,
  subscriptions,
} from '../subscription/subscription.schema';
import { groups } from '../workspace/workspace.schema';

@Injectable()
export class DashboardRepository {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<any>) {}

  async findRecentActivitiesByWorkspace(
    workspaceId: string,
    limit: number = 10,
  ) {
    const result = await this.db
      .select({
        id: subscriptionHistory.id,
        action: subscriptionHistory.action,
        title: subscriptionHistory.title,
        metadata: subscriptionHistory.metadata,
        createdAt: subscriptionHistory.createdAt,
        subscriptionId: subscriptionHistory.subscriptionId,
        subscriptionName: subscriptions.name,
      })
      .from(subscriptionHistory)
      .innerJoin(
        subscriptions,
        eq(subscriptionHistory.subscriptionId, subscriptions.id),
      )
      .innerJoin(groups, eq(subscriptions.groupId, groups.id))
      .where(eq(groups.workspaceId, workspaceId))
      .orderBy(desc(subscriptionHistory.createdAt))
      .limit(limit);

    return result;
  }

  async findActiveSubscriptionsByWorkspace(workspaceId: string) {
    const result = await this.db
      .select()
      .from(subscriptions)
      .innerJoin(groups, eq(subscriptions.groupId, groups.id))
      .where(
        and(
          eq(groups.workspaceId, workspaceId),
          sql`${subscriptions.status} = 'active'`,
        ),
      );

    return result.map((r) => r.subscriptions);
  }
}
