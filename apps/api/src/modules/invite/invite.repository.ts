import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq } from 'drizzle-orm';
import { DRIZZLE } from '../../core/db/drizzle.provider';
import { Invitation, invitations, NewInvitation } from './invite.schema';

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

  async findPendingByEmail(email: string): Promise<Invitation[]> {
    return this.db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.inviteeEmail, email),
          eq(invitations.status, 'pending'),
        ),
      )
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
}
