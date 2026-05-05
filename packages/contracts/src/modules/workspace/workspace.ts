import { email, z } from "zod";
import { createZodDto } from "nestjs-zod";
import type { Actions, Events } from "../../types";
import { cdtoSuccess } from "../../helpers";

const workspace = z.object({
  id: z.string(),
  name: z.string(),
  isOwner: z.boolean(),
  isCurrent: z.boolean(),
});

const createWorkspacePayload = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
});

const updateCurrentWorkspacePayload = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

const readManyWorkspaceParams = z.object({
  workspaceId: z.string(),
});

const updateCurrentWorkspaceResponse = z.object({
  id: z.string(),
  name: z.string(),
  isOwner: z.boolean(),
  isCurrent: z.boolean(),
});

const updateWorkspaceSetting = z.object({
  name: z.string(),
});

const workspaceActions = {
  create: {
    payload: createWorkspacePayload,
    response: {
      ok: cdtoSuccess(workspace),
    },
  },
  readMany: {
    response: {
      ok: cdtoSuccess(
        z.object({
          defaultWorkspace: workspace,
          list: z.array(workspace),
        }),
      ),
    },
  },
  readManyMembers: {
    params: readManyWorkspaceParams,
    response: {
      ok: cdtoSuccess(
        z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            role: z.string(),
            joinedAt: z.date(),
          }),
        ),
      ),
    },
  },
  updateCurrent: {
    payload: updateCurrentWorkspacePayload,
    response: {
      ok: cdtoSuccess(updateCurrentWorkspaceResponse),
    },
  },
  updateSetting: {
    params: z.object({
      workspaceId: z.string(),
    }),
    payload: updateWorkspaceSetting,
    response: {
      ok: cdtoSuccess(updateCurrentWorkspaceResponse),
    },
  },
} as const;

export type WorkspaceActions = Actions<typeof workspaceActions>;

export class WorkspaceReadManyResponseOkDto extends createZodDto(
  workspaceActions.readMany.response.ok,
) {}

export class WorkspaceCreatePayloadDto extends createZodDto(
  workspaceActions.create.payload,
) {}

export class WorkspaceCreateResponseOkDto extends createZodDto(
  workspaceActions.create.response.ok,
) {}

export class WorkspaceUpdateCurrentPayloadDto extends createZodDto(
  workspaceActions.updateCurrent.payload,
) {}

export class WorkspaceUpdateCurrentResponseOkDto extends createZodDto(
  workspaceActions.updateCurrent.response.ok,
) {}

export class WorkspaceUpdateSettingPayloadDto extends createZodDto(
  workspaceActions.updateSetting.payload,
) {}

export class WorkspaceUpdateSettingParamsDto extends createZodDto(
  workspaceActions.updateSetting.params,
) {}

export class WorkspaceUpdateSettingResponseOkDto extends createZodDto(
  workspaceActions.updateSetting.response.ok,
) {}

export class WorkspaceReadManyMembersParamsDto extends createZodDto(
  workspaceActions.readManyMembers.params,
) {}

export class WorkspaceReadManyMembersResponseOkDto extends createZodDto(
  workspaceActions.readManyMembers.response.ok,
) {}
