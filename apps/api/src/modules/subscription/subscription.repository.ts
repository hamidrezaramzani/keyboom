import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/core/db/drizzle.provider';
import {
  NewSubscription,
  NewSubscriptionHistory,
  Subscription,
  subscriptionHistory,
  subscriptions,
} from './subscription.schema';
import { categories } from '../category/category.schema';
import {
  SubscriptionPeriod,
  subscriptionPeriods,
} from '../subscription-period/subscription-period.schema';
import { groups } from '../workspace/workspace.schema';

@Injectable()
export class SubscriptionRepository {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<any>) {}

  async findById(id: string): Promise<Subscription | undefined> {
    const result = await this.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, id))
      .limit(1);
    return result[0];
  }

  async create(data: NewSubscription): Promise<Subscription> {
    const result = await this.db.insert(subscriptions).values(data).returning();
    return result[0];
  }

  async update(
    id: string,
    data: Partial<Omit<NewSubscription, 'id' | 'userId'>>,
  ): Promise<Subscription> {
    const result = await this.db
      .update(subscriptions)
      .set(data)
      .where(eq(subscriptions.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(subscriptions).where(eq(subscriptions.id, id));
  }

  async findCategoryBySubscriptionId(categoryId: string) {
    const category = await this.db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    return category[0];
  }

  async createSubscriptionHistory(data: NewSubscriptionHistory): Promise<void> {
    await this.db.insert(subscriptionHistory).values(data);
  }

  async cancel(id: string): Promise<Subscription> {
    const result = await this.db
      .update(subscriptions)
      .set({
        status: 'cancelled',
        endDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, id))
      .returning();
    return result[0];
  }

  async findPeriodsBySubscriptionId(
    subscriptionId: string,
  ): Promise<SubscriptionPeriod[]> {
    return this.db
      .select()
      .from(subscriptionPeriods)
      .where(eq(subscriptionPeriods.subscriptionId, subscriptionId))
      .orderBy(subscriptionPeriods.startDate);
  }

  async findHistoryBySubscriptionId(subscriptionId: string) {
    return this.db
      .select()
      .from(subscriptionHistory)
      .where(eq(subscriptionHistory.subscriptionId, subscriptionId))
      .orderBy(desc(subscriptionHistory.createdAt));
  }

  async findRenewalsBySubscriptionId(subscriptionId: string) {
    return this.db
      .select({
        date: subscriptionHistory.createdAt,
        amount: subscriptions.price,
      })
      .from(subscriptionHistory)
      .innerJoin(
        subscriptions,
        eq(subscriptions.id, subscriptionHistory.subscriptionId),
      )
      .where(
        and(
          eq(subscriptionHistory.subscriptionId, subscriptionId),
          eq(subscriptionHistory.action, 'RENEWED'),
        ),
      )
      .orderBy(desc(subscriptionHistory.createdAt));
  }

  async getSubscriptionWithDetails(subscriptionId: string) {
    const result = await this.db
      .select({
        subscription: subscriptions,
        groupName: groups.name,
        categoryName: categories.name,
      })
      .from(subscriptions)
      .innerJoin(groups, eq(subscriptions.groupId, groups.id))
      .innerJoin(categories, eq(subscriptions.category, categories.id))
      .where(eq(subscriptions.id, subscriptionId))
      .limit(1);

    return result[0];
  }

  async getAllPriceHistory(subscriptionId: string) {
    const periods = await this.db
      .select({
        price: subscriptionPeriods.monthlyPrice,
        startDate: subscriptionPeriods.startDate,
      })
      .from(subscriptionPeriods)
      .where(eq(subscriptionPeriods.subscriptionId, subscriptionId))
      .orderBy(subscriptionPeriods.startDate);

    const subscription = await this.findById(subscriptionId);

    return [
      {
        price: subscription?.price || 0,
        startDate: subscription?.startDate,
      },
      ...periods,
    ];
  }
}
