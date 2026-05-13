import { pgTable, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { subscriptions } from '../subscription/subscription.schema';

export const subscriptionPeriods = pgTable('subscription_periods', {
  id: varchar('id', { length: 36 }).primaryKey(),
  subscriptionId: varchar('subscription_id', { length: 36 })
    .notNull()
    .references(() => subscriptions.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  monthlyPrice: integer('monthly_price').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type SubscriptionPeriod = typeof subscriptionPeriods.$inferSelect;
export type NewSubscriptionPeriod = typeof subscriptionPeriods.$inferInsert;
export const SubscriptionPeriodMigrationKey = 'subscription_periods';
