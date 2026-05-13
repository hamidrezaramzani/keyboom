import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import type { Actions } from "../../types";
import { cdtoSuccess } from "../../helpers";

const subscriptionPeriod = z.object({
  id: z.string(),
  subscriptionId: z.string(),
  title: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  monthlyPrice: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const createPeriodPayload = z.object({
  title: z.string().min(1, "Title is required"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  monthlyPrice: z.number().positive("Price must be positive"),
});

const updatePeriodPayload = createPeriodPayload.partial();

const periodActions = {
  create: {
    params: z.object({
      subscriptionId: z.string(),
    }),
    payload: createPeriodPayload,
    response: {
      ok: cdtoSuccess(subscriptionPeriod),
    },
  },
  readMany: {
    params: z.object({
      subscriptionId: z.string(),
    }),
    response: {
      ok: cdtoSuccess(z.array(subscriptionPeriod)),
    },
  },
  update: {
    params: z.object({
      periodId: z.string(),
      subscriptionId: z.string(),
    }),
    payload: updatePeriodPayload,
    response: {
      ok: cdtoSuccess(subscriptionPeriod),
    },
  },
  delete: {
    params: z.object({
      periodId: z.string(),
      subscriptionId: z.string(),
    }),
    response: {
      ok: cdtoSuccess(z.object({ success: z.boolean() })),
    },
  },
} as const;

export type SubscriptionPeriodActions = Actions<typeof periodActions>;

export class SubscriptionPeriodCreateParamsDto extends createZodDto(
  periodActions.create.params,
) {}
export class SubscriptionPeriodCreatePayloadDto extends createZodDto(
  periodActions.create.payload,
) {}
export class SubscriptionPeriodCreateResponseOkDto extends createZodDto(
  periodActions.create.response.ok,
) {}
export class SubscriptionPeriodReadManyParamsDto extends createZodDto(
  periodActions.readMany.params,
) {}
export class SubscriptionPeriodReadManyResponseOkDto extends createZodDto(
  periodActions.readMany.response.ok,
) {}
export class SubscriptionPeriodUpdateParamsDto extends createZodDto(
  periodActions.update.params,
) {}
export class SubscriptionPeriodUpdatePayloadDto extends createZodDto(
  periodActions.update.payload,
) {}
export class SubscriptionPeriodUpdateResponseOkDto extends createZodDto(
  periodActions.update.response.ok,
) {}
export class SubscriptionPeriodDeleteParamsDto extends createZodDto(
  periodActions.delete.params,
) {}
export class SubscriptionPeriodDeleteResponseOkDto extends createZodDto(
  periodActions.delete.response.ok,
) {}
