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
  SubscriptionCancelResponseOkDto,
  SubscriptionCreatePayloadDto,
  SubscriptionUpdatePayloadDto,
} from '@keyboom/contracts/server';

import { getFaMoment, getMonthName, toPersianDate } from './subscription.utils';

type DailyCost = {
  year: number;
  month: number;
  monthName: string;
  day: number;
  cost: number;
  period: Period;
  originalPrice: number;
  dailyPrice: number;
};

type Period = {
  title: string;
  startDate: Date;
  endDate: Date;
  monthlyPrice: number;
} | null;

type PeriodDetail = {
  title: string;
  startDate: Date | string;
  endDate: Date | string;
  monthlyPrice: number;
  days: DailyCost[];
  dayNumbers: number[];
};

type MonthlyData = {
  year: number;
  month: number;
  monthName: string;
  totalCost: number;
  days: DailyCost[];
  periodDetails: Map<string, PeriodDetail>;
};

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

  async renew(
    userId: string,
    subscriptionId: string,
    title: string,
    renewDate: Date,
  ) {
    const subscription =
      await this.sanityCheckService.checkSubscriptionIsExists(subscriptionId);

    const group = await this.sanityCheckService.checkGroupIsExists(
      subscription.groupId,
    );

    const workspace = await this.sanityCheckService.checkWorkspaceIsExists(
      group.workspaceId,
    );

    if (subscription.userId !== userId) {
      throw new ForbiddenException('You can only renew your own subscriptions');
    }

    if (renewDate <= subscription.endDate) {
      throw new BadRequestException(
        'Renew date must be after current end date',
      );
    }

    const isMember = await this.workspaceRepository.isUserMemberOfWorkspace(
      userId,
      workspace.id,
    );
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this workspace');
    }

    const oldEndDate = subscription.endDate;
    const updated = await this.subscriptionRepository.update(subscriptionId, {
      endDate: renewDate,
    });

    await this.subscriptionRepository.createSubscriptionHistory({
      id: this.generateId(),
      subscriptionId,
      userId,
      action: 'RENEWED',
      title,
      metadata: JSON.stringify({
        oldEndDate,
        newEndDate: renewDate,
      }),
    });

    const now = new Date();
    const status =
      updated.endDate < now
        ? 'expired'
        : updated.endDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000
          ? 'expiring'
          : 'active';

    const category =
      await this.subscriptionRepository.findCategoryBySubscriptionId(
        subscription.id,
      );
    return {
      ...updated,
      status,
      startDate: updated.startDate.toISOString(),
      endDate: updated.endDate.toISOString(),
      categoryKey: category?.key,
      categoryName: category?.name,
    };
  }

  async cancel(
    userId: string,
    subscriptionId: string,
    title: string,
  ): Promise<SubscriptionCancelResponseOkDto['data']> {
    const subscription =
      await this.sanityCheckService.checkSubscriptionIsExists(subscriptionId);

    await this.sanityCheckService.checkUserIsExists(userId);

    if (subscription.userId !== userId) {
      throw new ForbiddenException(
        'You can only cancel your own subscriptions',
      );
    }

    const group = await this.sanityCheckService.checkGroupIsExists(
      subscription.groupId,
    );
    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      group.workspaceId,
    );

    if (subscription.endDate < new Date()) {
      throw new BadRequestException('Subscription is already expired');
    }

    const cancelled = await this.subscriptionRepository.cancel(subscriptionId);

    await this.subscriptionRepository.createSubscriptionHistory({
      id: this.generateId(),
      subscriptionId,
      userId,
      action: 'CANCELLED',
      title,
      metadata: JSON.stringify({
        cancelledAt: new Date(),
        previousEndDate: subscription.endDate,
      }),
    });

    const status = 'cancelled';

    return {
      ...cancelled,
      status,
      startDate: cancelled.startDate.toISOString(),
      endDate: cancelled.endDate.toISOString(),
    };
  }
  async getStats(userId: string, subscriptionId: string) {
    const subscription =
      await this.sanityCheckService.checkSubscriptionIsExists(subscriptionId);

    if (subscription.userId !== userId) {
      throw new ForbiddenException(
        'You do not have access to this subscription',
      );
    }

    const periods =
      await this.subscriptionRepository.findPeriodsBySubscriptionId(
        subscriptionId,
      );
    const now = new Date();

    const subStart = new Date(subscription.startDate);
    const subEnd = new Date(subscription.endDate);

    let costToDate = 0;
    let current = new Date(subStart);

    while (current < now && current < subEnd) {
      const period = periods.find(
        (p) =>
          new Date(p.startDate) <= current && new Date(p.endDate) > current,
      );
      const monthlyPrice = period ? period.monthlyPrice : subscription.price;
      const daysInMonth = new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        0,
      ).getDate();
      const daysLeft = Math.min(
        daysInMonth - current.getDate() + 1,
        Math.ceil((now.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)),
      );
      costToDate += (monthlyPrice / daysInMonth) * daysLeft;
      current.setMonth(current.getMonth() + 1);
    }

    let costToEnd = 0;
    current = now > subEnd ? subEnd : now;

    while (current < subEnd) {
      const period = periods.find(
        (p) =>
          new Date(p.startDate) <= current && new Date(p.endDate) > current,
      );
      const monthlyPrice = period ? period.monthlyPrice : subscription.price;
      const daysInMonth = new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        0,
      ).getDate();
      const daysLeft = Math.min(
        daysInMonth - current.getDate() + 1,
        Math.ceil(
          (subEnd.getTime() - current.getTime()) / (1000 * 60 * 60 * 24),
        ),
      );
      costToEnd += (monthlyPrice / daysInMonth) * daysLeft;
      current.setMonth(current.getMonth() + 1);
    }

    let annualCost = 0;
    const annualStart = new Date(subStart);
    const annualEnd = new Date(subStart);
    annualEnd.setFullYear(annualEnd.getFullYear() + 1);

    while (annualStart < annualEnd) {
      const period = periods.find(
        (p) =>
          new Date(p.startDate) <= annualStart &&
          new Date(p.endDate) > annualStart,
      );
      const monthlyPrice = period ? period.monthlyPrice : subscription.price;
      annualCost += monthlyPrice;
      annualStart.setMonth(annualStart.getMonth() + 1);
    }
    const dailyCost = subscription.price / 30;

    return {
      costToDate: Math.round(costToDate),
      costToEnd: Math.round(costToEnd),
      annualCost: Math.round(annualCost),
      dailyCost: Math.round(dailyCost),
    };
  }

  async getReport(userId: string, subscriptionId: string) {
    const subscription =
      await this.sanityCheckService.checkSubscriptionIsExists(subscriptionId);

    if (subscription.userId !== userId) {
      throw new ForbiddenException(
        'You do not have access to this subscription',
      );
    }

    const details =
      await this.subscriptionRepository.getSubscriptionWithDetails(
        subscriptionId,
      );
    if (!details) {
      throw new NotFoundException('Subscription details not found');
    }

    const now = new Date();
    const endDate = new Date(subscription.endDate);
    const remainingDays = Math.max(
      0,
      Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const countdown = remainingDays;

    const monthlyCostOverTime = await this.calculateDailyCostOverTime(
      subscriptionId,
      subscription.price,
      subscription.startDate,
      subscription.endDate,
    );

    const dailyCostOverTime = await this.calculateDailyCostOverTime(
      subscriptionId,
      subscription.price,
      subscription.startDate,
    );

    const totalSpentUntilToday = Math.round(
      dailyCostOverTime.reduce((a, b) => a + b.cost, 0),
    );

    const renewalsData =
      await this.subscriptionRepository.findRenewalsBySubscriptionId(
        subscriptionId,
      );
    const renewals = renewalsData.map((item) => ({
      date: toPersianDate(item.date),
      amount: item.amount,
    }));

    const renewalCount = renewals.length;
    const currentPrice = subscription.price;

    let status = 'فعال';
    if (subscription.status === 'cancelled') status = 'لغو شده';
    else if (subscription.endDate < new Date()) status = 'منقضی شده';
    else if (remainingDays <= 7) status = 'در حال اتمام';

    return {
      name: subscription.name,
      status,
      startDate: subscription.startDate.toString(),
      endDate: subscription.endDate.toString(),
      groupName: details.groupName,
      categoryName: details.categoryName,
      countdown,
      totalSpent: totalSpentUntilToday,
      currentPrice,
      renewalCount,
      remainingDays,
      costOverTime: monthlyCostOverTime,
    };
  }

  private async calculateDailyCostOverTime(
    subscriptionId: string,
    subscriptionMonthlyPrice: number,
    startDate: Date,
    endDate?: Date,
  ) {
    const periods =
      await this.subscriptionRepository.findPeriodsBySubscriptionId(
        subscriptionId,
      );

    const start = getFaMoment(startDate);
    const end = endDate ? getFaMoment(endDate) : getFaMoment(new Date());

    const result = [];
    const currentDate = start.clone();

    while (currentDate <= end) {
      const period = periods.find((p) => {
        const periodStart = getFaMoment(p.startDate);
        const periodEnd = p.endDate ? getFaMoment(p.endDate) : null;
        return (
          periodStart <= currentDate && (!periodEnd || periodEnd > currentDate)
        );
      });

      const monthlyPrice = period
        ? period.monthlyPrice
        : subscriptionMonthlyPrice;
      const dailyPrice = monthlyPrice / 30;

      result.push({
        year: currentDate.get('year'),
        month: currentDate.get('month') + 1,
        monthName: getMonthName(currentDate.get('month')),
        day: currentDate.get('date'),
        cost: dailyPrice,
        period: period
          ? {
              title: period.title,
              startDate: period.startDate,
              endDate: period.endDate,
              monthlyPrice: period.monthlyPrice,
            }
          : null,
        originalPrice: monthlyPrice,
        dailyPrice: dailyPrice,
      });

      currentDate.add(1, 'day');
    }

    const monthlyResult = this.aggregateDailyToMonthly(result);

    return monthlyResult;
  }

  private aggregateDailyToMonthly(dailyData: DailyCost[]) {
    const monthlyMap = new Map<string, MonthlyData>();

    dailyData?.forEach((day) => {
      const key = `${day.year}-${day.month}`;

      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, {
          year: day.year,
          month: day.month,
          monthName: day.monthName,
          totalCost: 0,
          days: [],
          periodDetails: new Map<string, PeriodDetail>(),
        });
      }

      const monthData = monthlyMap.get(key)!;
      monthData.totalCost += day.cost;
      monthData.days.push(day);

      if (day.period) {
        const periodKey = day.period.title;
        if (!monthData.periodDetails.has(periodKey)) {
          monthData.periodDetails.set(periodKey, {
            title: day.period.title,
            startDate: day.period.startDate,
            endDate: day.period.endDate,
            monthlyPrice: day.period.monthlyPrice,
            days: [],
            dayNumbers: [],
          });
        }

        const periodInfo = monthData.periodDetails.get(periodKey)!;
        periodInfo.days.push(day);
        periodInfo.dayNumbers.push(day.day);
      }
    });

    return Array.from(monthlyMap.values()).map((item) => ({
      year: item.year,
      month: item.month,
      monthName: item.monthName,
      cost: Math.round(item.totalCost * 100) / 100,
      periods: Array.from(item.periodDetails.values()).map((period) => ({
        title: period.title,
        startDate: period.startDate.toString(),
        endDate: period.endDate.toString(),
        monthlyPrice: period.monthlyPrice,
        daysCount: period.days.length,
        dayRange: {
          start: Math.min(...period.dayNumbers),
          end: Math.max(...period.dayNumbers),
        },
        affectedDays: period.dayNumbers,
      })),
    }));
  }
}
