import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, desc, eq, ne } from 'drizzle-orm';
import { DRIZZLE } from '../../core/db/drizzle.provider';
import { Invitation, invitations, NewInvitation } from './invite.schema';
import { workspaces } from '../workspace/workspace.schema';
import { users } from '../user/user.schema';

@Injectable()
export class InvitationRepository {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<any>) {}

  async create(data: NewInvitation): Promise<Invitation> {
    const result = await this.db.insert(invitations).values(data).returning();
    return result[0];
  }

  async findById(id: string): Promise<Invitation | undefined> {
    const result = await this.db
      .select()
      .from(invitations)
      .where(eq(invitations.id, id))
      .limit(1);
    return result[0];
  }

  async findByWorkspaceId(workspaceId: string): Promise<Invitation[]> {
    return this.db
      .select()
      .from(invitations)
      .where(eq(invitations.workspaceId, workspaceId))
      .orderBy(invitations.invitedAt);
  }

  async findPendingByEmailAndWorkspace(
    email: string,
    workspaceId: string,
  ): Promise<Invitation | undefined> {
    const result = await this.db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.inviteeEmail, email),
          eq(invitations.workspaceId, workspaceId),
          eq(invitations.status, 'pending'),
        ),
      )
      .limit(1);
    return result[0];
  }

  async updateStatus(
    id: string,
    status: 'accepted' | 'rejected' | 'expired',
  ): Promise<Invitation | undefined> {
    const result = await this.db
      .update(invitations)
      .set({ status, respondedAt: new Date() })
      .where(eq(invitations.id, id))
      .returning();
    return result[0];
  }

  async findPendingByEmail(email: string, invitationId?: string) {
    const conditions = [
      eq(invitations.inviteeEmail, email),
      eq(invitations.status, 'pending'),
    ];

    if (invitationId) {
      conditions.push(eq(invitations.id, invitationId));
    }

    return this.db
      .select({
        id: invitations.id,
        workspaceId: invitations.workspaceId,
        workspaceName: workspaces.name,
        inviterId: invitations.inviterId,
        inviterName: users.fullName,
        inviterEmail: users.email,
        inviteeEmail: invitations.inviteeEmail,
        status: invitations.status,
        invitedAt: invitations.invitedAt,
        respondedAt: invitations.respondedAt,
        expiresAt: invitations.expiresAt,
      })
      .from(invitations)
      .innerJoin(workspaces, eq(invitations.workspaceId, workspaces.id))
      .innerJoin(users, eq(invitations.inviterId, users.id))
      .where(and(...conditions))
      .orderBy(desc(invitations.invitedAt));
  }

  async findHistoryByEmail(email: string) {
    const user = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const userEmail = user[0]?.email;

    return this.db
      .select({
        id: invitations.id,
        workspaceId: invitations.workspaceId,
        workspaceName: workspaces.name,
        inviterId: invitations.inviterId,
        inviterName: users.fullName,
        inviterEmail: users.email,
        inviteeEmail: invitations.inviteeEmail,
        status: invitations.status,
        invitedAt: invitations.invitedAt,
        respondedAt: invitations.respondedAt,
        expiresAt: invitations.expiresAt,
      })
      .from(invitations)
      .innerJoin(workspaces, eq(invitations.workspaceId, workspaces.id))
      .innerJoin(users, eq(invitations.inviterId, users.id))
      .where(
        and(
          eq(invitations.inviteeEmail, userEmail),
          ne(invitations.status, 'pending'),
        ),
      )
      .orderBy(desc(invitations.respondedAt));
  }
}
