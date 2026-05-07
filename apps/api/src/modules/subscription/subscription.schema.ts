import {
  pgTable,
  varchar,
  integer,
  timestamp,
  boolean,
  text,
} from 'drizzle-orm/pg-core';
import { users } from '../user/user.schema';
import { groups } from '../workspace/workspace.schema';
import { categories } from '../category/category.schema';

export const subscriptions = pgTable('subscriptions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  groupId: varchar('group_id', { length: 36 })
    .notNull()
    .references(() => groups.id, { onDelete: 'cascade' }),
  category: varchar('category_id', { length: 36 })
    .notNull()
    .references(() => categories.id, { onDelete: 'restrict' }),
  name: varchar('name', { length: 255 }).notNull(),
  price: integer('price').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  website: varchar('website', { length: 500 }),
  description: text('description'),
  reminderDays: integer('reminder_days').default(3),
  isArchived: boolean('is_archived').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export const SubscriptionMigrationKey = 'subscriptions';
