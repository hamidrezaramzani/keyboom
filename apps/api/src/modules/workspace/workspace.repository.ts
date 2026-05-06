import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/core/db/drizzle.provider';
import {
  workspaces,
  NewWorkspace,
  Workspace,
  workspaceMembers,
  NewWorkspaceMember,
  WorkspaceMember,
  groups,
  NewGroup,
  Group,
} from './workspace.schema';
import { and, eq } from 'drizzle-orm';
import { users } from '../user/user.schema';

@Injectable()
export class WorkspaceRepository {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<any>) {}

  async initiateWorkspaceForUser(
    userId: string,
    fullName: string,
  ): Promise<{
    workspace: Workspace;
    member: WorkspaceMember;
    defaultGroup: Group;
  }> {
    const workspaceName = `${fullName} - شخصی`;
    const newWorkspace: NewWorkspace = {
      id: crypto.randomUUID(),
      name: workspaceName,
      ownerId: userId,
      isArchived: false,
    };

    const workspaceResult = await this.db
      .insert(workspaces)
      .values(newWorkspace)
      .returning();
    const workspace = workspaceResult[0];

    await this.db
      .update(users)
      .set({ defaultWorkspaceId: workspace.id })
      .where(eq(users.id, userId))
      .returning();

    const newMember: NewWorkspaceMember = {
      id: crypto.randomUUID(),
      workspaceId: workspace.id,
      userId: userId,
      isActive: true,
    };

    const memberResult = await this.db
      .insert(workspaceMembers)
      .values(newMember)
      .returning();
    const member = memberResult[0];

    const newGroup: NewGroup = {
      id: crypto.randomUUID(),
      workspaceId: workspace.id,
      name: 'بدون نام',
      order: '0',
      isArchived: false,
    };

    const groupResult = await this.db
      .insert(groups)
      .values(newGroup)
      .returning();
    const defaultGroup = groupResult[0];

    return { workspace, member, defaultGroup };
  }

  async findWorkspacesByUserId(userId: string) {
    const workspaceMembersList = await this.db
      .select()
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
      .where(
        and(
          eq(workspaceMembers.userId, userId),
          eq(workspaceMembers.isActive, true),
          eq(workspaces.isArchived, false),
        ),
      );

    return workspaceMembersList.map((item) => item.workspaces);
  }

  async createWorkspace(
    userId: string,
    name: string,
  ): Promise<{
    workspace: Workspace;
    member: WorkspaceMember;
    defaultGroup: Group;
  }> {
    const newWorkspace: NewWorkspace = {
      id: crypto.randomUUID(),
      name: name,
      ownerId: userId,
      isArchived: false,
    };

    const workspaceResult = await this.db
      .insert(workspaces)
      .values(newWorkspace)
      .returning();
    const workspace = workspaceResult[0];

    const newMember: NewWorkspaceMember = {
      id: crypto.randomUUID(),
      workspaceId: workspace.id,
      userId: userId,
      isActive: true,
    };

    const memberResult = await this.db
      .insert(workspaceMembers)
      .values(newMember)
      .returning();
    const member = memberResult[0];

    const newGroup: NewGroup = {
      id: crypto.randomUUID(),
      workspaceId: workspace.id,
      name: 'بدون نام',
      order: '0',
      isArchived: false,
    };

    const groupResult = await this.db
      .insert(groups)
      .values(newGroup)
      .returning();
    const defaultGroup = groupResult[0];

    return { workspace, member, defaultGroup };
  }

  async findWorkspaceById(workspaceId: string): Promise<Workspace | undefined> {
    const result = await this.db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    return result[0];
  }

  async updateUserDefaultWorkspace(userId: string, workspaceId: string) {
    await this.db
      .update(users)
      .set({ defaultWorkspaceId: workspaceId })
      .where(eq(users.id, userId));
  }

  async updateWorkspaceSetting(workspaceId: string, body: { name: string }) {
    await this.db
      .update(workspaces)
      .set({
        name: body.name,
      })
      .where(eq(workspaces.id, workspaceId));
  }

  async isUserMemberOfWorkspace(
    userId: string,
    workspaceId: string,
  ): Promise<boolean> {
    const result = await this.db
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.userId, userId),
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.isActive, true),
        ),
      )
      .limit(1);

    return result.length > 0;
  }

  async getUserDefaultWorkspaceId(userId: string): Promise<string | null> {
    const result = await this.db
      .select({ defaultWorkspaceId: users.defaultWorkspaceId })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return result[0]?.defaultWorkspaceId || null;
  }

  async isUserMemberOfWorkspaceByEmail(
    email: string,
    workspaceId: string,
  ): Promise<boolean> {
    const result = await this.db
      .select()
      .from(workspaceMembers)
      .innerJoin(users, eq(workspaceMembers.userId, users.id))
      .where(
        and(
          eq(users.email, email),
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.isActive, true),
        ),
      )
      .limit(1);
    return result.length > 0;
  }

  async addMemberToWorkspace(
    userId: string,
    workspaceId: string,
  ): Promise<void> {
    await this.db.insert(workspaceMembers).values({
      id: crypto.randomUUID(),
      workspaceId,
      userId,
      isActive: true,
      invitedAt: new Date(),
      joinedAt: new Date(),
    });
  }

  async getWorkspaceMembers(workspaceId: string) {
    const members = await this.db
      .select({
        id: users.id,
        name: users.fullName,
        email: users.email,
        role: workspaceMembers.role,
        joinedAt: workspaceMembers.joinedAt,
      })
      .from(workspaceMembers)
      .innerJoin(users, eq(workspaceMembers.userId, users.id))
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.isActive, true),
        ),
      );
    return members;
  }

  async removeUserFromWorkspace(
    userId: string,
    workspaceId: string,
  ): Promise<void> {
    await this.db
      .delete(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.userId, userId),
          eq(workspaceMembers.workspaceId, workspaceId),
        ),
      );
  }
}
