import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from '../subscription/subscription.repository';
import { GroupRepository } from '../group/group.repository';
import { SanityCheckService } from '../sanity-check/sanity-check.service';
import { Subscription } from '../subscription/subscription.schema';
import { DashboardRepository } from './dashboard.repository';
import { getFaMoment } from '../subscription/subscription.utils';
import { SubscriptionService } from '../subscription/subscription.service';
import { CategoriesRepository } from '../category/category.repository';
import moment from 'jalali-moment';

@Injectable()
export class DashboardService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly subscriptionService: SubscriptionService,
    private readonly groupRepository: GroupRepository,
    private readonly categoryRepository: CategoriesRepository,
    private readonly sanityCheckService: SanityCheckService,
    private readonly dashboardRepository: DashboardRepository,
  ) {}

  getRandomPastelColor(): string {
    const r = Math.floor(Math.random() * 128) + 128;
    const g = Math.floor(Math.random() * 128) + 128;
    const b = Math.floor(Math.random() * 128) + 128;

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  async getDashboard(userId: string, range: '3' | '6' | '12') {
    const user = await this.sanityCheckService.checkUserIsExists(userId);

    if (!user.defaultWorkspaceId) return;
    const workspaceId = user.defaultWorkspaceId;

    await this.sanityCheckService.checkWorkspaceIsExists(workspaceId);
    await this.sanityCheckService.checkUserIsWorkspaceMember(
      userId,
      workspaceId,
    );

    const groups = await this.groupRepository.findByWorkspaceId(workspaceId);
    const groupIds = groups.map((g) => g.id);
    const activeSubscriptions =
      await this.subscriptionRepository.findByGroupIds(groupIds);

    const subscriptionCalendar = activeSubscriptions.map((sub) => ({
      id: sub.id,
      name: sub.name,
      price: sub.price,
      category: sub.category,
      startDate: moment(sub.startDate).locale('fa').format('YYYY/jMM/jDD'),
      endDate: moment(sub.endDate).locale('fa').format('YYYY/jMM/jDD'),
      color: this.getRandomPastelColor(),
    }));

    const stats = await this.calculateStats(activeSubscriptions);
    const lastActivities = await this.getLastActivities(workspaceId);
    const costPerMonthly = await this.calculateMonthlyCost(
      activeSubscriptions,
      range,
    );
    const costPerCategories =
      await this.calculateCategoryCosts(activeSubscriptions);
    const topSubscriptions = this.getTopSubscriptions(activeSubscriptions);
    return {
      stats,
      lastActivities,
      costPerMonthly,
      costPerCategories,
      topSubscriptions,
      subscriptionCalendar,
    };
  }

  private async calculateStats(subscriptions: Subscription[]) {
    let totalCost = 0;

    let totalMonthPrice = 0;

    await Promise.all(
      subscriptions.map(async (sub) => {
        const subMonths =
          await this.subscriptionService.calculateDailyCostOverTime(
            sub.id,
            sub.price,
            moment().startOf('month').toDate(),
            moment().toDate(),
          );

        totalMonthPrice = subMonths[0].cost;
      }),
    );
    await Promise.all(
      subscriptions.map(async (sub) => {
        const totalMonths =
          await this.subscriptionService.calculateDailyCostOverTime(
            sub.id,
            sub.price,
            sub.startDate,
          );

        const totalMonthPrice = totalMonths.reduce((a, b) => a + b.cost, 0);

        totalCost += totalMonthPrice;
      }),
    );

    // TODO: محاسبه آمارها
    return {
      totalCost,
      averageMonthly: 0,
      activeSubscriptions: subscriptions.length,
      currentMonthCost: totalMonthPrice,
    };
  }

  private async getLastActivities(workspaceId: string) {
    const history =
      await this.dashboardRepository.findRecentActivitiesByWorkspace(
        workspaceId,
        10,
      );

    return history.map((item) => {
      let type:
        | 'renewal'
        | 'period_added'
        | 'period_removed'
        | 'price_change'
        | 'subscription_created'
        | 'subscription_cancelled' = 'subscription_created';
      let description = null;
      let amount = null;

      switch (item.action) {
        case 'RENEWED': {
          type = 'renewal';
          const metadata = JSON.parse(item.metadata || '{}') as {
            oldEndDate: string;
            newEndDate: string;
          };
          description = `تمدید از ${new Date(metadata.oldEndDate).toLocaleDateString('fa-IR')} به ${new Date(metadata.newEndDate).toLocaleDateString('fa-IR')}`;
          break;
        }
        case 'CANCELLED':
          type = 'subscription_cancelled';
          description = item.title || 'اشتراک لغو شد';
          break;
        case 'CREATED':
          type = 'subscription_created';
          description = 'اشتراک جدید ایجاد شد';
          break;
        case 'PERIOD_ADDED':
          type = 'period_added';
          description = item.title || 'بازه قیمتی جدید اضافه شد';
          break;
        case 'PERIOD_REMOVED':
          type = 'period_removed';
          description = item.title || 'بازه قیمتی حذف شد';
          break;
        case 'PRICE_CHANGED': {
          type = 'price_change';
          const priceMetadata = JSON.parse(item.metadata || '{}') as {
            oldEndDate: string;
            newEndDate: string;
            newPrice: number;
            oldPrice: number;
          };
          amount = priceMetadata.newPrice;
          description = `قیمت از ${priceMetadata.oldPrice?.toLocaleString()} به ${priceMetadata.newPrice?.toLocaleString()} تومان تغییر کرد`;
          break;
        }
      }

      return {
        id: item.id,
        type,
        title: item.title || item.action,
        description,
        amount,
        date: getFaMoment(item.createdAt).format('jYYYY/jMM/jDD'),
        subscriptionId: item.subscriptionId,
        subscriptionName: item.subscriptionName,
      };
    });
  }

  private async calculateMonthlyCost(
    subscriptions: Subscription[],
    range: '3' | '6' | '12',
  ) {
    const monthlyCosts = await this.subscriptionService.calculateMonthlyCost(
      subscriptions,
      range,
    );

    return monthlyCosts;
  }

  private async calculateCategoryCosts(subscriptions: Subscription[]) {
    const categories = await this.categoryRepository.findAll();
    const categoryMap = new Map<
      string,
      {
        categoryId: string;
        categoryName: string;
        categoryKey: string;
        cost: number;
      }
    >();

    for (const category of categories) {
      categoryMap.set(category.id, {
        categoryId: category.id,
        categoryName: category.name,
        categoryKey: category.key,
        cost: 0,
      });
    }

    for (const sub of subscriptions) {
      const categoryData = categoryMap.get(sub.category);
      if (categoryData) {
        categoryData.cost += sub.price;
      }
    }

    const totalCost = Array.from(categoryMap.values()).reduce(
      (sum, cat) => sum + cat.cost,
      0,
    );

    const result = Array.from(categoryMap.values())
      .filter((cat) => cat.cost > 0)
      .map((cat) => ({
        ...cat,
        percentage:
          totalCost > 0 ? Math.round((cat.cost / totalCost) * 100) : 0,
      }))
      .sort((a, b) => b.cost - a.cost);

    return result;
  }

  private getTopSubscriptions(subscriptions: Subscription[]) {
    return subscriptions
      .sort((a, b) => b.price - a.price)
      .slice(0, 4)
      .map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        categoryName: s.category || '',
        status: s.status as string,
      }));
  }
}
