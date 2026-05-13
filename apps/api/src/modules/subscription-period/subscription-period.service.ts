import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { SubscriptionPeriodRepository } from './subscription-period.repository';
import { SubscriptionRepository } from '../subscription/subscription.repository';
import { GroupRepository } from '../group/group.repository';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { SanityCheckService } from '../sanity-check/sanity-check.service';
import { WebSocketGateway } from '../websocket/websocket.gateway';
import { customAlphabet } from 'nanoid';

@Injectable()
export class SubscriptionPeriodService {
  constructor(
    private readonly periodRepo: SubscriptionPeriodRepository,
    private readonly subscriptionRepo: SubscriptionRepository,
    private readonly groupRepo: GroupRepository,
    private readonly workspaceRepo: WorkspaceRepository,
    private readonly sanityCheckService: SanityCheckService,
    private readonly wsGateway: WebSocketGateway,
  ) {}

  private generateId(): string {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 21);
    return nanoid();
  }

  async create(
    userId: string,
    subscriptionId: string,
    data: {
      title: string;
      startDate: string;
      endDate: string;
      monthlyPrice: number;
    },
  ) {
    const subscription = await this.subscriptionRepo.findById(subscriptionId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription?.userId !== userId) {
      throw new ForbiddenException(
        'You can only manage your own subscriptions',
      );
    }

    const group = await this.groupRepo.findById(subscription.groupId);
    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      group.workspaceId,
    );

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (startDate < subscription.startDate || endDate > subscription.endDate) {
      throw new BadRequestException('Period must be within subscription range');
    }

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    const overlapping = await this.periodRepo.findOverlapping(
      subscriptionId,
      startDate,
      endDate,
    );
    if (overlapping.length > 0) {
      throw new BadRequestException('Period overlaps with existing period');
    }

    const period = await this.periodRepo.create({
      id: this.generateId(),
      subscriptionId,
      title: data.title,
      startDate,
      endDate,
      monthlyPrice: data.monthlyPrice,
    });

    return period;
  }

  async readMany(userId: string, subscriptionId: string) {
    const subscription = await this.subscriptionRepo.findById(subscriptionId);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription?.userId !== userId) {
      throw new ForbiddenException('You can only view your own subscriptions');
    }

    return this.periodRepo.findBySubscriptionId(subscriptionId);
  }

  async update(
    userId: string,
    periodId: string,
    data: Partial<{
      title: string;
      startDate: string;
      endDate: string;
      monthlyPrice: number;
    }>,
  ) {
    const period = await this.periodRepo.findById(periodId);
    if (!period) {
      throw new NotFoundException('Period not found');
    }

    const subscription = await this.subscriptionRepo.findById(
      period.subscriptionId,
    );
    if (subscription?.userId !== userId) {
      throw new ForbiddenException(
        'You can only manage your own subscriptions',
      );
    }

    const group = await this.groupRepo.findById(subscription.groupId);
    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      group.workspaceId,
    );

    const updateData: Partial<{
      title: string;
      startDate: Date;
      endDate: Date;
      monthlyPrice: number;
    }> = {};
    if (data.title) updateData.title = data.title;
    if (data.monthlyPrice) updateData.monthlyPrice = data.monthlyPrice;

    if (data.startDate || data.endDate) {
      const startDate = data.startDate
        ? new Date(data.startDate)
        : period.startDate;
      const endDate = data.endDate ? new Date(data.endDate) : period.endDate;

      if (
        startDate < subscription.startDate ||
        endDate > subscription.endDate
      ) {
        throw new BadRequestException(
          'Period must be within subscription range',
        );
      }

      if (startDate >= endDate) {
        throw new BadRequestException('Start date must be before end date');
      }

      const overlapping = await this.periodRepo.findOverlappingExcept(
        period.subscriptionId,
        startDate,
        endDate,
        periodId,
      );
      if (overlapping.length > 0) {
        throw new BadRequestException('Period overlaps with existing period');
      }

      updateData.startDate = startDate;
      updateData.endDate = endDate;
    }

    const updated = await this.periodRepo.update(periodId, updateData);

    return updated;
  }

  async delete(userId: string, periodId: string) {
    const period = await this.periodRepo.findById(periodId);
    if (!period) {
      throw new NotFoundException('Period not found');
    }

    const subscription = await this.subscriptionRepo.findById(
      period.subscriptionId,
    );
    if (subscription?.userId !== userId) {
      throw new ForbiddenException(
        'You can only manage your own subscriptions',
      );
    }

    const group = await this.groupRepo.findById(subscription.groupId);
    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      group.workspaceId,
    );

    await this.periodRepo.delete(periodId);
  }
}
