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

    const newMember: NewWorkspaceMember = {
      id: crypto.randomUUID(),
      workspaceId: workspace.id,
      userId: userId,
      role: 'owner',
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
}
