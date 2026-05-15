import { Inject, Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
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
}
