import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { GroupRepository } from '../group/group.repository';
import { SanityCheckService } from '../sanity-check/sanity-check.service';
import { customAlphabet } from 'nanoid';
import { SubscriptionRepository } from './subscription.repository';
import {
  SubscriptionCreatePayloadDto,
  SubscriptionUpdatePayloadDto,
} from '@keyboom/contracts/server';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly groupRepository: GroupRepository,
    private readonly sanityCheckService: SanityCheckService,
  ) {}

  private generateId(): string {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 21);
    return nanoid();
  }

  async create(userId: string, data: SubscriptionCreatePayloadDto) {
    const group = await this.sanityCheckService.checkGroupIsExists(
      data.groupId,
    );
    await this.sanityCheckService.checkWorkspaceIsExists(group.workspaceId);

    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      group.workspaceId,
    );

    const subscription = await this.subscriptionRepository.create({
      id: this.generateId(),
      userId,
      groupId: data.groupId,
      category: data.categoryId,
      name: data.name,
      price: data.price,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      website: data.website || null,
      description: data.description || null,
      reminderDays: data.reminderDays || 3,
    });

    const now = new Date();
    const status =
      subscription.endDate < now
        ? 'expired'
        : subscription.endDate.getTime() - now.getTime() <
            7 * 24 * 60 * 60 * 1000
          ? 'expiring'
          : 'active';

    const result = {
      ...subscription,
      status,
      startDate: subscription.startDate.toISOString(),
      endDate: subscription.endDate.toISOString(),
    };

    return result;
  }

  async update(
    userId: string,
    subscriptionId: string,
    data: SubscriptionUpdatePayloadDto,
  ) {
    const subscription =
      await this.sanityCheckService.checkSubscriptionIsExists(subscriptionId);

    const group = await this.groupRepository.findById(subscription.groupId);
    const workspace = await this.workspaceRepository.findWorkspaceById(
      group.workspaceId,
    );
    const isMember = await this.workspaceRepository.isUserMemberOfWorkspace(
      userId,
      workspace?.id || '',
    );
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this workspace');
    }

    const updated = await this.subscriptionRepository.update(subscriptionId, {
      name: data.name,
      price: data.price,
      category: data.categoryId,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      website: data.website,
      description: data.description,
      reminderDays: data.reminderDays,
    });

    const now = new Date();
    const status =
      updated.endDate < now
        ? 'expired'
        : updated.endDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000
          ? 'expiring'
          : 'active';

    const result = {
      ...updated,
      status,
      startDate: subscription.startDate.toISOString(),
      endDate: subscription.endDate.toISOString(),
    };

    return result;
  }

  async move(userId: string, subscriptionId: string, newGroupId: string) {
    const subscription =
      await this.sanityCheckService.checkSubscriptionIsExists(subscriptionId);

    const oldGroup = await this.groupRepository.findById(subscription.groupId);
    const newGroup = await this.groupRepository.findById(newGroupId);
    if (!newGroup) {
      throw new NotFoundException('Target group not found');
    }

    if (oldGroup.workspaceId !== newGroup.workspaceId) {
      throw new BadRequestException(
        'Cannot move subscription between different workspaces',
      );
    }

    const workspace = await this.sanityCheckService.checkWorkspaceIsExists(
      oldGroup.workspaceId,
    );
    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      workspace?.id,
    );

    await this.subscriptionRepository.update(subscriptionId, {
      groupId: newGroupId,
    });
  }

  async delete(userId: string, subscriptionId: string) {
    const subscription =
      await this.sanityCheckService.checkSubscriptionIsExists(subscriptionId);

    const group = await this.groupRepository.findById(subscription.groupId);
    const workspace = await this.sanityCheckService.checkWorkspaceIsExists(
      group.workspaceId,
    );
    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      workspace.id,
    );

    await this.subscriptionRepository.delete(subscriptionId);
  }
}
