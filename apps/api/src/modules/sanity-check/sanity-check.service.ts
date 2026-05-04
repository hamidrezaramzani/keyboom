import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from 'src/core/db/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { UsersRepository } from '../user/user.repository';

@Injectable()
export class SanityCheckService {
  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  async checkUserIsExists(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async checkWorkspaceIsExists(workspaceId: string) {
    const workspace =
      await this.workspaceRepository.findWorkspaceById(workspaceId);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace;
  }

  async checkUserIsWorkspaceMember(userId: string, workspaceId: string) {
    const isMember = await this.workspaceRepository.isUserMemberOfWorkspace(
      userId,
      workspaceId,
    );
    if (!isMember) {
      throw new NotFoundException(
        'Workspace not found or you are not a member',
      );
    }
  }
}
