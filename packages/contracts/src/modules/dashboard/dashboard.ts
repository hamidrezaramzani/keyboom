import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import type { Actions } from "../../types";
import { cdtoSuccess } from "../../helpers";

const lastActivitySchema = z.object({
  id: z.string(),
  type: z.enum([
    "renewal",
    "period_added",
    "period_removed",
    "price_change",
    "subscription_created",
    "subscription_cancelled",
  ]),
  title: z.string(),
  description: z.string().nullable(),
  amount: z.number().nullable(),
  date: z.string(),
  subscriptionId: z.string(),
  subscriptionName: z.string(),
});

const monthlyCostSchema = z.object({
  month: z.string(),
  cost: z.number(),
});

const categoryCostSchema = z.object({
  categoryId: z.string(),
  categoryName: z.string(),
  categoryKey: z.string(),
  cost: z.number(),
  percentage: z.number(),
});

const topSubscriptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  categoryName: z.string(),
  status: z.string(),
});

const dashboardStatsSchema = z.object({
  totalCost: z.number(),
  averageMonthly: z.number(),
  activeSubscriptions: z.number(),
  currentMonthCost: z.number(),
});

const getDashboardParams = z.object({
  range: z.enum(["3", "6", "12"]).default("6"),
});

const subscriptionCalendarSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  category: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  color: z.string(),
});

const getDashboardResponseSchema = z.object({
  stats: dashboardStatsSchema,
  subscriptionCalendar: z.array(subscriptionCalendarSchema),
  lastActivities: z.array(lastActivitySchema),
  costPerMonthly: z.array(monthlyCostSchema),
  costPerCategories: z.array(categoryCostSchema),
  topSubscriptions: z.array(topSubscriptionSchema),
});

const dashboardActions = {
  getDashboard: {
    params: getDashboardParams,
    response: {
      ok: cdtoSuccess(getDashboardResponseSchema),
    },
  },
} as const;

export type DashboardActions = Actions<typeof dashboardActions>;

export class GetDashboardParamsDto extends createZodDto(
  dashboardActions.getDashboard.params,
) {}

export class GetDashboardResponseOkDto extends createZodDto(
  dashboardActions.getDashboard.response.ok,
) {}
