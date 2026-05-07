import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from 'src/core/db/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { WorkspaceRepository } from './workspace.repository';
import { UsersRepository } from '../user/user.repository';
import { SanityCheckService } from '../sanity-check/sanity-check.service';
import { WorkspaceUpdateSettingPayloadDto } from '@keyboom/contracts/server';
import { customAlphabet } from 'nanoid';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class WorkspaceService {
  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly userRepository: UsersRepository,
    private readonly sanityCheckService: SanityCheckService,
    private readonly notificationService: NotificationService,
  ) {}

  private generateId(): string {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 21);
    return nanoid();
  }

  async readMany(userId: string) {
    const workspaces =
      await this.workspaceRepository.findWorkspacesByUserId(userId);

    const user = await this.userRepository.findById(userId);
    const defaultWorkspace = workspaces.find(
      (ws) => ws.id === user?.defaultWorkspaceId,
    );

    if (!defaultWorkspace) {
      throw new NotFoundException('Default workspace is not found');
    }

    return {
      defaultWorkspace: {
        id: defaultWorkspace.id,
        name: defaultWorkspace.name,
        isOwner: defaultWorkspace.ownerId === userId,
        isCurrent: defaultWorkspace.id === defaultWorkspace.id,
      },
      list: workspaces.map((ws) => ({
        id: ws.id,
        name: ws.name,
        isOwner: ws.ownerId === userId,
        isCurrent: ws.id === defaultWorkspace.id,
      })),
    };
  }

  async create(
    userId: string,
    name: string,
  ): Promise<{
    id: string;
    name: string;
    ownerId: string;
    isOwner: boolean;
    isCurrent: boolean;
    createdAt: Date;
  }> {
    const { workspace } = await this.workspaceRepository.createWorkspace(
      userId,
      name,
    );

    await this.workspaceRepository.updateUserDefaultWorkspace(
      userId,
      workspace.id,
    );

    return {
      id: workspace.id,
      name: workspace.name,
      ownerId: workspace.ownerId,
      isOwner: true,
      isCurrent: true,
      createdAt: workspace.createdAt,
    };
  }

  async updateCurrentWorkspace(userId: string, workspaceId: string) {
    const isMember = await this.workspaceRepository.isUserMemberOfWorkspace(
      userId,
      workspaceId,
    );
    if (!isMember) {
      throw new NotFoundException(
        'Workspace not found or you are not a member',
      );
    }

    await this.workspaceRepository.updateUserDefaultWorkspace(
      userId,
      workspaceId,
    );

    const workspace =
      await this.workspaceRepository.findWorkspaceById(workspaceId);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return {
      id: workspace.id,
      name: workspace.name,
      isOwner: workspace.ownerId === userId,
      isCurrent: true,
    };
  }

  async updateWorkspaceSetting(
    userId: string,
    workspaceId: string,
    body: WorkspaceUpdateSettingPayloadDto,
  ) {
    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      workspaceId,
    );

    const workspace =
      await this.sanityCheckService.checkWorkspaceIsExists(workspaceId);

    await this.workspaceRepository.updateWorkspaceSetting(workspaceId, {
      name: body.name,
    });

    return {
      id: workspace.id,
      name: workspace.name,
      isOwner: workspace.ownerId === userId,
      isCurrent: true,
    };
  }

  async getWorkspaceMembers(userId: string, workspaceId: string) {
    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      workspaceId,
    );

    const members =
      await this.workspaceRepository.getWorkspaceMembers(workspaceId);

    return members;
  }

  async leaveWorkspace(userId: string, workspaceId: string) {
    const user = await this.sanityCheckService.checkUserIsExists(userId);

    const workspace =
      await this.sanityCheckService.checkWorkspaceIsExists(workspaceId);

    await this.sanityCheckService.checkWorkspaceOwnerCanNotLeave(
      userId,
      workspaceId,
    );

    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      workspaceId,
    );

    await this.workspaceRepository.removeUserFromWorkspace(userId, workspaceId);

    await this.notificationService.create({
      userId: workspace.ownerId,
      workspaceId: workspaceId,
      type: 'workspace_leave',
      title: `خروج از فضای کاربری`,
      message: `کاربر ${user.fullName} از فضای کاربری ${workspace.name} خارج شد`,
      metadata: JSON.stringify({ userId }),
      id: this.generateId(),
    });

    const defaultWorkspaceId =
      await this.workspaceRepository.getUserDefaultWorkspaceId(userId);
    if (defaultWorkspaceId && defaultWorkspaceId === workspaceId) {
      const otherWorkspaces =
        await this.workspaceRepository.findWorkspacesByUserId(userId);
      const newDefaultWorkspaceId = otherWorkspaces[0]?.id;
      await this.workspaceRepository.updateUserDefaultWorkspace(
        userId,
        newDefaultWorkspaceId,
      );
    }
  }

  async deleteWorkspace(userId: string, workspaceId: string) {
    await this.sanityCheckService.checkWorkspaceIsExists(workspaceId);

    await this.workspaceRepository.deleteWorkspace(workspaceId);

    const remainingWorkspaces =
      await this.workspaceRepository.findWorkspacesByUserId(userId);
    const newDefaultWorkspaceId = remainingWorkspaces[0]?.id;
    await this.workspaceRepository.updateUserDefaultWorkspace(
      userId,
      newDefaultWorkspaceId,
    );
  }
}
