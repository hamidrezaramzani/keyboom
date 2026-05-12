import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import type { Actions } from "../../types";
import { cdtoSuccess } from "../../helpers";

const subscription = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  category: z.string(), // TODO this field should return caregory info
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
  reminderDays: z.number().min(0).max(30).default(3),
});

const updateSubscriptionPayload = createSubscriptionPayload.partial();

const moveSubscriptionPayload = z.object({
  groupId: z.string(),
});

const deleteSubscriptionParams = z.object({
  subscriptionId: z.string(),
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
  delete: {
    params: deleteSubscriptionParams,
    response: {
      ok: cdtoSuccess(z.object({ success: z.boolean() })),
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
export class SubscriptionDeleteParamsDto extends createZodDto(
  subscriptionActions.delete.params,
) {}
export class SubscriptionDeleteResponseOkDto extends createZodDto(
  subscriptionActions.delete.response.ok,
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
