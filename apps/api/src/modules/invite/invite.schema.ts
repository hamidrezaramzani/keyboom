import { index, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { workspaces } from '../workspace/workspace.schema';
import { users } from '../user/user.schema';

export const invitations = pgTable(
  'invitations',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    workspaceId: varchar('workspace_id', { length: 36 }).notNull(),
    inviterId: varchar('inviter_id', { length: 36 }).notNull(),
    inviteeEmail: varchar('invitee_email', { length: 255 }).notNull(),
    status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, accepted, rejected, expired
    invitedAt: timestamp('invited_at').defaultNow().notNull(),
    respondedAt: timestamp('responded_at'),
    expiresAt: timestamp('expires_at').notNull(),
  },
  (table) => ({
    workspaceIdIdx: index('invitations_workspace_id_idx').on(table.workspaceId),
    inviterIdIdx: index('invitations_inviter_id_idx').on(table.inviterId),
    inviteeEmailIdx: index('invitations_invitee_email_idx').on(
      table.inviteeEmail,
    ),
    statusIdx: index('invitations_status_idx').on(table.status),
  }),
);

export const invitationsRelations = relations(invitations, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [invitations.workspaceId],
    references: [workspaces.id],
  }),
  inviter: one(users, {
    fields: [invitations.inviterId],
    references: [users.id],
  }),
}));

export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;

export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'expired';
export type InvitationRole = 'admin' | 'member';

export const InvitationMigrationKey = 'invitations';
