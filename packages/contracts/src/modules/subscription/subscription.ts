import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import type { Actions } from "../../types";
import { cdtoSuccess } from "../../helpers";

const subscription = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  category: z.string(),
  groupId: z.string(),
  userId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  website: z.string().nullable(),
  description: z.string().nullable(),
  reminderDays: z.number().nullable(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const createSubscriptionPayload = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  groupId: z.string().min(1, "Group is required"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  website: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
  reminderDays: z.number().min(0).max(7).default(3),
});

const updateSubscriptionPayload = createSubscriptionPayload.partial();

const moveSubscriptionPayload = z.object({
  groupId: z.string(),
});

const deleteSubscriptionParams = z.object({
  subscriptionId: z.string(),
});

const periodDetailInMonthSchema = z.object({
  title: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  monthlyPrice: z.number(),
  daysInMonth: z.array(z.number()).optional(),
  dateRange: z
    .object({
      start: z.number(),
      end: z.number(),
    })
    .optional(),
});

const monthlyCostSchema = z.object({
  year: z.number(),
  month: z.number(),
  monthName: z.string(),
  cost: z.number(),
  periods: z.array(periodDetailInMonthSchema),
});

const subscriptionActions = {
  create: {
    payload: createSubscriptionPayload,
    response: {
      ok: cdtoSuccess(subscription),
    },
  },
  update: {
    params: z.object({
      subscriptionId: z.string(),
    }),
    payload: updateSubscriptionPayload,
    response: {
      ok: cdtoSuccess(subscription),
    },
  },
  move: {
    params: z.object({
      subscriptionId: z.string(),
    }),
    payload: moveSubscriptionPayload,
    response: {
      ok: cdtoSuccess(z.object({ success: z.boolean() })),
    },
  },
  renew: {
    params: z.object({
      subscriptionId: z.string(),
    }),
    payload: z.object({
      title: z.string().min(1, "Title is required"),
      renewDate: z.string().datetime(),
    }),
    response: {
      ok: cdtoSuccess(subscription),
    },
  },
  cancel: {
    params: z.object({
      subscriptionId: z.string(),
    }),
    payload: z.object({
      title: z.string().min(1, "Title is required"),
    }),
    response: {
      ok: cdtoSuccess(subscription),
    },
  },
  getStats: {
    params: z.object({
      subscriptionId: z.string(),
    }),
    response: {
      ok: cdtoSuccess(
        z.object({
          costToDate: z.number(),
          costToEnd: z.number(),
          annualCost: z.number(),
          dailyCost: z.number(),
        }),
      ),
    },
  },

  getReport: {
    params: z.object({
      subscriptionId: z.string(),
    }),
    response: {
      ok: cdtoSuccess(
        z.object({
          name: z.string(),
          status: z.string(),
          startDate: z.string(),
          endDate: z.string(),

          groupName: z.string(),
          categoryName: z.string(),
          countdown: z.number(),

          totalSpent: z.number(),
          currentPrice: z.number(),
          renewalCount: z.number(),
          remainingDays: z.number(),

          costOverTime: z.array(monthlyCostSchema),
        }),
      ),
    },
  },
} as const;

export type SubscriptionActions = Actions<typeof subscriptionActions>;

export class SubscriptionCreatePayloadDto extends createZodDto(
  subscriptionActions.create.payload,
) {}
export class SubscriptionCreateResponseOkDto extends createZodDto(
  subscriptionActions.create.response.ok,
) {}
export class SubscriptionUpdateParamsDto extends createZodDto(
  subscriptionActions.update.params,
) {}
export class SubscriptionUpdatePayloadDto extends createZodDto(
  subscriptionActions.update.payload,
) {}
export class SubscriptionUpdateResponseOkDto extends createZodDto(
  subscriptionActions.update.response.ok,
) {}
export class SubscriptionMoveParamsDto extends createZodDto(
  subscriptionActions.move.params,
) {}
export class SubscriptionMovePayloadDto extends createZodDto(
  subscriptionActions.move.payload,
) {}
export class SubscriptionMoveResponseOkDto extends createZodDto(
  subscriptionActions.move.response.ok,
) {}

export class SubscriptionRenewParamsDto extends createZodDto(
  subscriptionActions.renew.params,
) {}
export class SubscriptionRenewPayloadDto extends createZodDto(
  subscriptionActions.renew.payload,
) {}
export class SubscriptionRenewResponseOkDto extends createZodDto(
  subscriptionActions.renew.response.ok,
) {}

export class SubscriptionCancelParamsDto extends createZodDto(
  subscriptionActions.cancel.params,
) {}
export class SubscriptionCancelPayloadDto extends createZodDto(
  subscriptionActions.cancel.payload,
) {}
export class SubscriptionCancelResponseOkDto extends createZodDto(
  subscriptionActions.cancel.response.ok,
) {}

export class SubscriptionGetStatsParamsDto extends createZodDto(
  subscriptionActions.getStats.params,
) {}
export class SubscriptionGetStatsResponseOkDto extends createZodDto(
  subscriptionActions.getStats.response.ok,
) {}

export class SubscriptionGetReportParamsDto extends createZodDto(
  subscriptionActions.getReport.params,
) {}

export class SubscriptionGetReportResponseOkDto extends createZodDto(
  subscriptionActions.getReport.response.ok,
) {}
