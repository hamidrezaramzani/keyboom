import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { users } from '../user/user.schema';

export const tickets = pgTable('tickets', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('open'),
  priority: varchar('priority', { length: 20 }).notNull().default('medium'),
  category: varchar('category', { length: 50 }).notNull().default('general'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const ticketMessages = pgTable('ticket_messages', {
  id: varchar('id', { length: 36 }).primaryKey(),
  ticketId: varchar('ticket_id', { length: 36 })
    .notNull()
    .references(() => tickets.id, { onDelete: 'cascade' }),
  senderId: varchar('sender_id', { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  receiverId: varchar('receiver_id', { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
export type TicketMessage = typeof ticketMessages.$inferSelect;
export type NewTicketMessage = typeof ticketMessages.$inferInsert;

export const TicketMigrationKey = 'tickets';
export const TicketMessageMigrationKey = 'ticket_messages';
