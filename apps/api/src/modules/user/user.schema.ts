import { relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { workspaces } from '../workspace/workspace.schema';

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    defaultWorkspaceId: varchar('default_workspace_id', {
      length: 36,
    }),
    isActive: boolean('is_active').notNull().default(true),
    isAdmin: boolean('is_admin').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
    isActiveIdx: index('users_is_active_idx').on(table.isActive),
  }),
);

export const usersRelations = relations(users, ({ one }) => ({
  defaultWorkspace: one(workspaces, {
    fields: [users.defaultWorkspaceId],
    references: [workspaces.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const UserMigrationKey = 'users';
