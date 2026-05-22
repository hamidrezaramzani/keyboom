import { Inject, Injectable } from '@nestjs/common';
import { and, eq, asc, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/core/db/drizzle.provider';
import { groups } from '../workspace/workspace.schema';
import { subscriptions } from '../subscription/subscription.schema';
import { categories } from '../category/category.schema';

@Injectable()
export class GroupRepository {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<any>) {}
  async findById(id: string) {
    const result = await this.db
      .select()
      .from(groups)
      .where(eq(groups.id, id))
      .limit(1);
    return result[0];
  }

  async findArchivedById(id: string) {
    const result = await this.db
      .select()
      .from(groups)
      .where(and(eq(groups.id, id), eq(groups.isArchived, true)))
      .limit(1);
    return result[0];
  }

  findByWorkspaceId(workspaceId: string) {
    return this.db
      .select()
      .from(groups)
      .where(and(eq(groups.workspaceId, workspaceId)))
      .orderBy(asc(groups.order));
  }

  async findActiveByWorkspaceId(workspaceId: string) {
    return this.db
      .select()
      .from(groups)
      .where(
        and(eq(groups.workspaceId, workspaceId), eq(groups.isArchived, false)),
      );
  }

  async findByWorkspaceIdWithSubscriptions(workspaceId: string) {
    const groupsList = await this.findByWorkspaceId(workspaceId);

    const subscriptionsList = await this.db
      .select({
        id: subscriptions.id,
        name: subscriptions.name,
        price: subscriptions.price,
        startDate: subscriptions.startDate,
        endDate: subscriptions.endDate,
        website: subscriptions.website,
        description: subscriptions.description,
        reminderDays: subscriptions.reminderDays,
        createdAt: subscriptions.createdAt,
        updatedAt: subscriptions.updatedAt,
        userId: subscriptions.userId,
        groupId: subscriptions.groupId,
        category: {
          id: categories.id,
          name: categories.name,
        },
        group: {
          id: groups.id,
          name: groups.name,
        },
      })
      .from(subscriptions)
      .innerJoin(categories, eq(subscriptions.category, categories.id))
      .innerJoin(groups, eq(subscriptions.groupId, groups.id));

    const now = new Date();
    const subscriptionsWithStatus = subscriptionsList.map((sub) => ({
      ...sub,
      status:
        sub.endDate < now
          ? 'expired'
          : sub.endDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000
            ? 'expiring'
            : 'active',
    }));

    const subscriptionsByGroup = subscriptionsWithStatus.reduce(
      (acc, sub) => {
        if (!sub.groupId) return acc;
        if (!acc[sub.groupId]) acc[sub.groupId] = [];
        acc[sub.groupId].push(sub);
        return acc;
      },
      {} as Record<string, typeof subscriptionsWithStatus>,
    );

    return groupsList.map((group) => ({
      ...group,
      subscriptions: subscriptionsByGroup[group.id] || [],
    }));
  }
  async create(data: {
    id: string;
    workspaceId: string;
    name: string;
    order: string;
    isArchived: boolean;
  }) {
    const result = await this.db.insert(groups).values(data).returning();
    return result[0];
  }

  async update(
    id: string,
    data: { name?: string; supervisorId?: string | null },
  ) {
    const result = await this.db
      .update(groups)
      .set(data)
      .where(eq(groups.id, id))
      .returning();
    return result[0];
  }

  async updateOrder(id: string, order: string) {
    await this.db.update(groups).set({ order }).where(eq(groups.id, id));
  }

  async getNextOrder(workspaceId: string): Promise<number> {
    const result = await this.db
      .select({ maxOrder: sql<string>`MAX(${groups.order})` })
      .from(groups)
      .where(eq(groups.workspaceId, workspaceId));
    const maxOrder = parseInt(result[0]?.maxOrder || '0');
    return maxOrder + 1;
  }

  async archive(id: string) {
    await this.db
      .update(groups)
      .set({ isArchived: true, archivedAt: new Date() })
      .where(eq(groups.id, id));
  }

  async restore(id: string) {
    await this.db
      .update(groups)
      .set({ isArchived: false, archivedAt: null })
      .where(eq(groups.id, id));
  }

  async delete(id: string) {
    await this.db.delete(groups).where(eq(groups.id, id));
  }

  async moveSubscriptionsToGroup(fromGroupId: string, toGroupId: string) {
    await this.db
      .update(subscriptions)
      .set({ groupId: toGroupId })
      .where(eq(subscriptions.groupId, fromGroupId));
  }
}
