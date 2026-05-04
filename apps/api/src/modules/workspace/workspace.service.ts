import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from 'src/core/db/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { WorkspaceRepository } from './workspace.repository';
import { UsersRepository } from '../user/user.repository';
import { SanityCheckService } from '../sanity-check/sanity-check.service';
import { WorkspaceUpdateSettingPayloadDto } from '@keyboom/contracts/server';

@Injectable()
export class WorkspaceService {
  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly userRepository: UsersRepository,
    private readonly sanityCheckService: SanityCheckService,
  ) {}
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
}
