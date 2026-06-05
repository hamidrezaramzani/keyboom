import { Inject, Injectable } from '@nestjs/common';
import { eq, desc, like, asc, and } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/core/db/drizzle.provider';
import {
  NewTicket,
  NewTicketMessage,
  Ticket,
  ticketMessages,
  tickets,
} from './ticket.schema';
import { users } from '../user/user.schema';

@Injectable()
export class TicketRepository {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<Ticket>) {}

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(tickets)
      .where(eq(tickets.id, id))
      .limit(1);
    return result[0];
  }

  findMany(
    userId: string,
    filters: {
      status?: string;
      priority?: string;
      category?: string;
      search?: string;
    },
  ) {
    const conditions = [];

    conditions.push(eq(tickets.userId, userId));
    if (filters.status) {
      conditions.push(eq(tickets.status, filters.status));
    }

    if (filters.priority) {
      conditions.push(eq(tickets.priority, filters.priority));
    }

    if (filters.category) {
      conditions.push(eq(tickets.category, filters.category));
    }

    if (filters.search) {
      conditions.push(like(tickets.title, `%${filters.search}%`));
    }
    const finalWhere = conditions.length > 0 ? and(...conditions) : undefined;

    const query = this.db.select().from(tickets);

    if (conditions.length > 0) {
      query.where(finalWhere);
    }

    return query.orderBy(desc(tickets.createdAt));
  }

  async create(data: NewTicket) {
    const result = await this.db.insert(tickets).values(data).returning();
    return result[0];
  }

  async updateStatus(id: string, status: string) {
    const result = await this.db
      .update(tickets)
      .set({ status, updatedAt: new Date() })
      .where(eq(tickets.id, id))
      .returning();
    return result[0];
  }

  async getMessages(ticketId: string) {
    const messages = await this.db
      .select({
        id: ticketMessages.id,
        ticketId: ticketMessages.ticketId,
        senderId: ticketMessages.senderId,
        message: ticketMessages.message,
        isRead: ticketMessages.isRead,
        createdAt: ticketMessages.createdAt,
        senderName: users.fullName,
        senderIsAdmin: users.isAdmin,
      })
      .from(ticketMessages)
      .innerJoin(users, eq(ticketMessages.senderId, users.id))
      .where(eq(ticketMessages.ticketId, ticketId))
      .orderBy(asc(ticketMessages.createdAt));

    return messages;
  }

  async addMessage(data: NewTicketMessage) {
    const result = await this.db
      .insert(ticketMessages)
      .values(data)
      .returning();
    return result[0];
  }
}
