import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { SanityCheckService } from '../sanity-check/sanity-check.service';
import { customAlphabet } from 'nanoid';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly sanityCheckService: SanityCheckService,
  ) {}

  private generateId(): string {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 21);
    return nanoid();
  }

  async create(userId: string, name: string) {
    const defaultWorkspaceId =
      await this.workspaceRepository.getUserDefaultWorkspaceId(userId);
    if (!defaultWorkspaceId) {
      throw new BadRequestException('No workspace found');
    }

    const isMember = await this.workspaceRepository.isUserMemberOfWorkspace(
      userId,
      defaultWorkspaceId,
    );
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this workspace');
    }

    const order = await this.groupRepository.getNextOrder(defaultWorkspaceId);

    const group = await this.groupRepository.create({
      id: this.generateId(),
      workspaceId: defaultWorkspaceId,
      name,
      order: String(order),
      isArchived: false,
    });

    return group;
  }

  async readMany(userId: string, workspaceId: string) {
    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      workspaceId,
    );

    const groups =
      await this.groupRepository.findByWorkspaceIdWithSubscriptions(
        workspaceId,
      );

    return groups;
  }

  async update(
    userId: string,
    groupId: string,
    body: { name?: string; supervisorId?: string | null },
  ) {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      group.workspaceId,
    );

    const updated = await this.groupRepository.update(groupId, body);
    return updated;
  }

  async reorder(userId: string, groupIds: string[]) {
    if (groupIds.length === 0) {
      throw new BadRequestException('No groups to reorder');
    }

    const firstGroup = await this.groupRepository.findById(groupIds[0]);
    if (!firstGroup) {
      throw new NotFoundException('Group not found');
    }

    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      firstGroup.workspaceId,
    );

    for (let i = 0; i < groupIds.length; i++) {
      await this.groupRepository.updateOrder(groupIds[i], String(i));
    }
  }

  async archive(userId: string, groupId: string) {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      group.workspaceId,
    );

    const activeGroups = await this.groupRepository.findActiveByWorkspaceId(
      group.workspaceId,
    );
    if (activeGroups.length === 1) {
      throw new BadRequestException('Cannot archive the last group');
    }

    await this.groupRepository.archive(groupId);
  }

  async restore(userId: string, groupId: string) {
    const group = await this.groupRepository.findArchivedById(groupId);
    if (!group) {
      throw new NotFoundException('Archived group not found');
    }

    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      group.workspaceId,
    );

    await this.groupRepository.restore(groupId);
  }

  async delete(userId: string, groupId: string, moveToGroupId?: string) {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      group.workspaceId,
    );

    const activeGroups = await this.groupRepository.findActiveByWorkspaceId(
      group.workspaceId,
    );
    if (activeGroups.length === 1) {
      throw new BadRequestException('Cannot delete the last group');
    }

    if (moveToGroupId) {
      const targetGroup = await this.groupRepository.findById(moveToGroupId);
      if (!targetGroup || targetGroup.workspaceId !== group.workspaceId) {
        throw new BadRequestException(
          'Target group not found in the same workspace',
        );
      }
      await this.groupRepository.moveSubscriptionsToGroup(
        groupId,
        moveToGroupId,
      );
    }

    await this.groupRepository.delete(groupId);
  }
}
