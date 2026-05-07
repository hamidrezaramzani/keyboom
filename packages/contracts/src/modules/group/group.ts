// packages/contracts/src/modules/group/group.ts
import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import type { Actions } from "../../types";
import { cdtoSuccess } from "../../helpers";

const group = z.object({
  id: z.string(),
  name: z.string(),
  workspaceId: z.string(),
  supervisorId: z.string().nullable(),
  order: z.string(),
  isArchived: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const groupWithSubscriptions = group.extend({
  subscriptions: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      category: z.string(),
      startDate: z.date(),
      endDate: z.date(),
      website: z.string().nullable(),
      description: z.string().nullable(),
      reminderDays: z.number().nullable(),
      status: z.string(),
    }),
  ),
});

const createGroupPayload = z.object({
  name: z.string().min(1, "Name is required"),
});

const updateGroupPayload = z.object({
  name: z.string().optional(),
  supervisorId: z.string().optional().nullable(),
});

const readManyGroupsParams = z.object({
  workspaceId: z.string(),
});

const reorderGroupsPayload = z.object({
  groupIds: z.array(z.string()),
});

const archiveGroupParams = z.object({
  groupId: z.string(),
});

const restoreGroupParams = z.object({
  groupId: z.string(),
});

const deleteGroupParams = z.object({
  groupId: z.string(),
  moveToGroupId: z.string().optional(),
});

const groupActions = {
  create: {
    payload: createGroupPayload,
    response: {
      ok: cdtoSuccess(group),
    },
  },
  readMany: {
    params: readManyGroupsParams,
    response: {
      ok: cdtoSuccess(z.array(groupWithSubscriptions)),
    },
  },
  update: {
    params: z.object({
      groupId: z.string(),
    }),
    payload: updateGroupPayload,
    response: {
      ok: cdtoSuccess(group),
    },
  },
  reorder: {
    payload: reorderGroupsPayload,
    response: {
      ok: cdtoSuccess(z.object({ success: z.boolean() })),
    },
  },
  archive: {
    params: archiveGroupParams,
    response: {
      ok: cdtoSuccess(z.object({ success: z.boolean() })),
    },
  },
  restore: {
    params: restoreGroupParams,
    response: {
      ok: cdtoSuccess(z.object({ success: z.boolean() })),
    },
  },
  delete: {
    params: deleteGroupParams,
    response: {
      ok: cdtoSuccess(z.object({ success: z.boolean() })),
    },
  },
} as const;

export type GroupActions = Actions<typeof groupActions>;

export class GroupCreatePayloadDto extends createZodDto(
  groupActions.create.payload,
) {}
export class GroupCreateResponseOkDto extends createZodDto(
  groupActions.create.response.ok,
) {}
export class GroupReadManyParamsDto extends createZodDto(
  groupActions.readMany.params,
) {}
export class GroupReadManyResponseOkDto extends createZodDto(
  groupActions.readMany.response.ok,
) {}
export class GroupUpdateParamsDto extends createZodDto(
  groupActions.update.params,
) {}
export class GroupUpdatePayloadDto extends createZodDto(
  groupActions.update.payload,
) {}
export class GroupUpdateResponseOkDto extends createZodDto(
  groupActions.update.response.ok,
) {}
export class GroupReorderPayloadDto extends createZodDto(
  groupActions.reorder.payload,
) {}
export class GroupReorderResponseOkDto extends createZodDto(
  groupActions.reorder.response.ok,
) {}
export class GroupArchiveParamsDto extends createZodDto(
  groupActions.archive.params,
) {}
export class GroupArchiveResponseOkDto extends createZodDto(
  groupActions.archive.response.ok,
) {}
export class GroupRestoreParamsDto extends createZodDto(
  groupActions.restore.params,
) {}
export class GroupRestoreResponseOkDto extends createZodDto(
  groupActions.restore.response.ok,
) {}
export class GroupDeleteParamsDto extends createZodDto(
  groupActions.delete.params,
) {}
export class GroupDeleteResponseOkDto extends createZodDto(
  groupActions.delete.response.ok,
) {}
