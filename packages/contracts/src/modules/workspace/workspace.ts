import { email, z } from "zod";
import { createZodDto } from "nestjs-zod";
import type { Actions } from "../../types";
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
