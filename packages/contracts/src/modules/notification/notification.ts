// packages/contracts/src/server/notification.contract.ts
import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import type { Actions } from "../../types";
import { cdtoSuccess } from "../../helpers";

const notification = z.object({
  id: z.string(),
  userId: z.string(),
  workspaceId: z.string().nullable(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  metadata: z.string().nullable(),
  isRead: z.boolean(),
  createdAt: z.date(),
  readAt: z.date().nullable(),
});

const getNotificationsResponse = z.object({
  data: z.array(notification),
  success: z.boolean(),
});

const getRecentNotificationsResponse = z.object({
  data: z.array(notification),
  success: z.boolean(),
});

const getUnreadCountResponse = z.object({
  data: z.object({
    count: z.number(),
  }),
  success: z.boolean(),
});

const markAsReadParams = z.object({
  id: z.string(),
});

const markAsReadResponse = z.object({
  data: notification,
  success: z.boolean(),
});

const markAllAsReadResponse = z.object({
  success: z.boolean(),
  message: z.string(),
});

const notificationActions = {
  getMany: {
    response: {
      ok: cdtoSuccess(getNotificationsResponse),
    },
  },
  getRecent: {
    response: {
      ok: cdtoSuccess(getRecentNotificationsResponse),
    },
  },
  getUnreadCount: {
    response: {
      ok: cdtoSuccess(getUnreadCountResponse),
    },
  },
  markAsRead: {
    params: markAsReadParams,
    response: {
      ok: cdtoSuccess(markAsReadResponse),
    },
  },
  markAllAsRead: {
    response: {
      ok: cdtoSuccess(markAllAsReadResponse),
    },
  },
} as const;

export type NotificationActions = Actions<typeof notificationActions>;

export class NotificationGetManyResponseOkDto extends createZodDto(
  notificationActions.getMany.response.ok,
) {}

export class NotificationGetRecentResponseOkDto extends createZodDto(
  notificationActions.getRecent.response.ok,
) {}

export class NotificationGetUnreadCountResponseOkDto extends createZodDto(
  notificationActions.getUnreadCount.response.ok,
) {}

export class NotificationMarkAsReadParamsDto extends createZodDto(
  notificationActions.markAsRead.params,
) {}

export class NotificationMarkAsReadResponseOkDto extends createZodDto(
  notificationActions.markAsRead.response.ok,
) {}

export class NotificationMarkAllAsReadResponseOkDto extends createZodDto(
  notificationActions.markAllAsRead.response.ok,
) {}
