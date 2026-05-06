import {
  pgTable,
  varchar,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { users } from '../user/user.schema';
import { relations } from 'drizzle-orm';
import { invitations } from '../invite/invite.schema';

export const workspaces = pgTable(
  'workspaces',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    ownerId: varchar('owner_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    isArchived: boolean('is_archived').notNull().default(false),
    archivedAt: timestamp('archived_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    ownerIdIdx: index('workspaces_owner_id_idx').on(table.ownerId),
    isArchivedIdx: index('workspaces_is_archived_idx').on(table.isArchived),
    nameIdx: index('workspaces_name_idx').on(table.name),
  }),
);

export const workspaceMembers = pgTable(
  'workspace_members',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    workspaceId: varchar('workspace_id', { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 20 }).notNull().default('member'), // owner, admin, member, viewer
    invitedBy: varchar('invited_by', { length: 36 }).references(() => users.id),
    invitedAt: timestamp('invited_at').defaultNow().notNull(),
    joinedAt: timestamp('joined_at'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdIdx: index('workspace_members_workspace_id_idx').on(
      table.workspaceId,
    ),
    userIdIdx: index('workspace_members_user_id_idx').on(table.userId),
    roleIdx: index('workspace_members_role_idx').on(table.role),
    uniqueWorkspaceUser: index('workspace_members_unique_idx').on(
      table.workspaceId,
      table.userId,
    ),
  }),
);

export const groups = pgTable(
  'groups',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    workspaceId: varchar('workspace_id', { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    supervisorId: varchar('supervisor_id', { length: 36 }).references(
      () => users.id,
      { onDelete: 'set null' },
    ),
    order: varchar('order', { length: 10 }).notNull().default('0'),
    isArchived: boolean('is_archived').notNull().default(false),
    archivedAt: timestamp('archived_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdIdx: index('groups_workspace_id_idx').on(table.workspaceId),
    supervisorIdIdx: index('groups_supervisor_id_idx').on(table.supervisorId),
    isArchivedIdx: index('groups_is_archived_idx').on(table.isArchived),
    workspaceOrderIdx: index('groups_workspace_order_idx').on(
      table.workspaceId,
      table.order,
    ),
  }),
);

export const groupMembers = pgTable(
  'group_members',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    groupId: varchar('group_id', { length: 36 })
      .notNull()
      .references(() => groups.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    assignedAt: timestamp('assigned_at').defaultNow().notNull(),
    assignedBy: varchar('assigned_by', { length: 36 }).references(
      () => users.id,
    ),
  },
  (table) => ({
    groupIdIdx: index('group_members_group_id_idx').on(table.groupId),
    userIdIdx: index('group_members_user_id_idx').on(table.userId),
    uniqueGroupUser: index('group_members_unique_idx').on(
      table.groupId,
      table.userId,
    ),
  }),
);

// ==================== Relations ====================

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  members: many(workspaceMembers),
  groups: many(groups),
  invitations: many(invitations),
}));

export const workspaceMembersRelations = relations(
  workspaceMembers,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceMembers.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [workspaceMembers.userId],
      references: [users.id],
    }),
    inviter: one(users, {
      fields: [workspaceMembers.invitedBy],
      references: [users.id],
    }),
  }),
);

export const groupsRelations = relations(groups, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [groups.workspaceId],
    references: [workspaces.id],
  }),
  supervisor: one(users, {
    fields: [groups.supervisorId],
    references: [users.id],
  }),
  members: many(groupMembers),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
  assigner: one(users, {
    fields: [groupMembers.assignedBy],
    references: [users.id],
  }),
}));

// ==================== Types ====================

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;

export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;

export type GroupMember = typeof groupMembers.$inferSelect;
export type NewGroupMember = typeof groupMembers.$inferInsert;

// ==================== Migration Key ====================

export const WorkspaceMigrationKey = 'workspaces';
export const WorkspaceMemberMigrationKey = 'workspace_members';
export const GroupMigrationKey = 'groups';
export const GroupMemberMigrationKey = 'group_members';
