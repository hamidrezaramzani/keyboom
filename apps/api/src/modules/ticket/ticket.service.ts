import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersRepository } from '../user/user.repository';
import { customAlphabet } from 'nanoid';
import { TicketRepository } from './ticket.repository';
import { SanityCheckService } from '../sanity-check/sanity-check.service';

@Injectable()
export class TicketService {
  constructor(
    private readonly ticketRepo: TicketRepository,
    private readonly userRepo: UsersRepository,
    private readonly sanityCheckServcice: SanityCheckService,
  ) {}

  private generateId(): string {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 21);
    return nanoid();
  }

  async create(
    userId: string,
    data: {
      title: string;
      priority: string;
      category: string;
      message: string;
    },
  ) {
    const admin = await this.userRepo.findAdmin();
    if (!admin) {
      throw new NotFoundException('No admin found');
    }

    const ticket = await this.ticketRepo.create({
      id: this.generateId(),
      userId,
      title: data.title,
      priority: data.priority,
      category: data.category,
      status: 'open',
    });

    await this.ticketRepo.addMessage({
      id: this.generateId(),
      ticketId: ticket.id,
      senderId: userId,
      receiverId: admin.id,
      message: data.message,
    });

    return {
      ...ticket,
      status: ticket.status as 'open' | 'in_progress' | 'answered' | 'closed',
      priority: ticket.priority as 'low' | 'medium' | 'high',
      category: ticket.category as 'subscription' | 'workspace' | 'general',
    };
  }

  async readMany(
    userId: string,
    query: {
      status?: string;
      priority?: string;
      category?: string;
      search?: string;
    },
  ) {
    await this.sanityCheckServcice.checkUserIsExists(userId);

    const tickets = await this.ticketRepo.findMany(userId, query);
    return tickets.map((ticket) => ({
      ...ticket,
      status: ticket.status as 'open' | 'in_progress' | 'answered' | 'closed',
      priority: ticket.priority as 'low' | 'medium' | 'high',
      category: ticket.category as 'subscription' | 'workspace' | 'general',
    }));
  }

  async readOne(_userId: string, ticketId: string) {
    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const messages = await this.ticketRepo.getMessages(ticketId);

    const typedTicket = {
      ...ticket,
      status: ticket.status as 'open' | 'in_progress' | 'answered' | 'closed',
      priority: ticket.priority as 'low' | 'medium' | 'high',
      category: ticket.category as 'subscription' | 'workspace' | 'general',
      isRead: false,
    };

    return {
      ticket: typedTicket,
      messages: messages.map((m) => ({ ...m, isRead: m.isRead || false })),
    };
  }

  async addMessage(userId: string, ticketId: string, message: string) {
    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const user = await this.sanityCheckServcice.checkUserIsExists(userId);
    const isAdmin = user?.isAdmin || false;

    if (ticket.userId !== userId && !isAdmin) {
      throw new ForbiddenException('You do not have access to this ticket');
    }

    const receiverId = isAdmin
      ? ticket.userId
      : (await this.userRepo.findAdmin())?.id;
    if (!receiverId) {
      throw new NotFoundException('Receiver not found');
    }

    const ticketMessage = await this.ticketRepo.addMessage({
      id: this.generateId(),
      ticketId,
      senderId: userId,
      receiverId,
      message,
    });

    if (ticket.status === 'open' && isAdmin) {
      await this.ticketRepo.updateStatus(ticketId, 'in_progress');
    }

    if (ticket.status === 'answered' && !isAdmin) {
      await this.ticketRepo.updateStatus(ticketId, 'in_progress');
    }

    return {
      ...ticketMessage,
      senderName: user?.fullName,
      senderId: userId,
      senderIsAdmin: isAdmin,
      isRead: ticketMessage.isRead || false,
    };
  }

  async close(userId: string, ticketId: string) {
    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const user = await this.userRepo.findById(userId);
    const isAdmin = user?.isAdmin || false;

    if (ticket.userId !== userId && !isAdmin) {
      throw new ForbiddenException('You do not have access to this ticket');
    }

    if (ticket.status === 'closed') {
      throw new ForbiddenException('Ticket is already closed');
    }

    await this.ticketRepo.updateStatus(ticketId, 'closed');
  }
}
