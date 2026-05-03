import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from 'src/core/db/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { WorkspaceRepository } from './workspace.repository';
import { UsersRepository } from '../user/user.repository';

@Injectable()
export class WorkspaceService {
  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly userRepository: UsersRepository,
  ) {}
  async readMany(
    userId: string,
  ): Promise<{ defaultWorkspace: { name: string }; list: { name: string }[] }> {
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
      defaultWorkspace: { name: defaultWorkspace?.name },
      list: workspaces.map((ws) => ({
        id: ws.id,
        name: ws.name,
        isOwner: ws.ownerId === userId,
        isCurrent: ws.id === defaultWorkspace.id,
      })),
    };
  }
}
