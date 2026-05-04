import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  index,
} from 'drizzle-orm/pg-core';
import { users } from '../user/user.schema';
import { workspaces } from '../workspace/workspace.schema';

export const notifications = pgTable(
  'notifications',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    workspaceId: varchar('workspace_id', { length: 36 }).references(
      () => workspaces.id,
      {
        onDelete: 'set null',
      },
    ),
    type: varchar('type', { length: 50 }).notNull(),
    title: text('title').notNull(),
    message: text('message').notNull(),
    metadata: text('metadata'),
    isRead: boolean('is_read').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    readAt: timestamp('read_at'),
  },
  (table) => ({
    userIdIdx: index('notifications_user_id_idx').on(table.userId),
    userUnreadIdx: index('notifications_user_unread_idx').on(
      table.userId,
      table.isRead,
    ),
    createdAtIdx: index('notifications_created_at_idx').on(table.createdAt),
  }),
);

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export const NotificationMigrationKey = 'notifications';
