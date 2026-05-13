import { Inject, Injectable } from '@nestjs/common';

import { eq, and, between, ne } from 'drizzle-orm';
import {
  NewSubscriptionPeriod,
  SubscriptionPeriod,
  subscriptionPeriods,
} from './subscription-period.schema';
import { DRIZZLE } from 'src/core/db/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class SubscriptionPeriodRepository {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<any>) {}

  async findById(id: string): Promise<SubscriptionPeriod | undefined> {
    const result = await this.db
      .select()
      .from(subscriptionPeriods)
      .where(eq(subscriptionPeriods.id, id))
      .limit(1);
    return result[0];
  }

  findBySubscriptionId(subscriptionId: string) {
    return this.db
      .select()
      .from(subscriptionPeriods)
      .where(eq(subscriptionPeriods.subscriptionId, subscriptionId))
      .orderBy(subscriptionPeriods.startDate);
  }

  findOverlapping(subscriptionId: string, startDate: Date, endDate: Date) {
    return this.db
      .select()
      .from(subscriptionPeriods)
      .where(
        and(
          eq(subscriptionPeriods.subscriptionId, subscriptionId),
          between(subscriptionPeriods.startDate, startDate, endDate),
        ),
      );
  }

  async findOverlappingExcept(
    subscriptionId: string,
    startDate: Date,
    endDate: Date,
    excludeId: string,
  ): Promise<SubscriptionPeriod[]> {
    return this.db
      .select()
      .from(subscriptionPeriods)
      .where(
        and(
          eq(subscriptionPeriods.subscriptionId, subscriptionId),
          ne(subscriptionPeriods.id, excludeId),
          between(subscriptionPeriods.startDate, startDate, endDate),
        ),
      );
  }

  async create(data: NewSubscriptionPeriod): Promise<SubscriptionPeriod> {
    const result = await this.db
      .insert(subscriptionPeriods)
      .values(data)
      .returning();
    return result[0];
  }

  async update(
    id: string,
    data: Partial<Omit<NewSubscriptionPeriod, 'id' | 'subscriptionId'>>,
  ): Promise<SubscriptionPeriod> {
    const result = await this.db
      .update(subscriptionPeriods)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(subscriptionPeriods.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<void> {
    await this.db
      .delete(subscriptionPeriods)
      .where(eq(subscriptionPeriods.id, id));
  }
}
