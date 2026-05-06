import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import type { Actions } from "../../types";
import { cdtoSuccess } from "../../helpers";

const invitation = z.object({
  id: z.string(),
  workspaceId: z.string(),
  workspaceName: z.string().optional(),
  inviterId: z.string(),
  inviterName: z.string().optional(),
  inviteeEmail: z.string(),
  status: z.enum(["pending", "accepted", "rejected", "expired"]),
  invitedAt: z.date(),
  respondedAt: z.date().nullable(),
  expiresAt: z.date(),
});

const createInvitationPayload = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),
  email: z.string().email("Invalid email format"),
});

const createInvitationResponse = z.object({
  id: z.string(),
  workspaceId: z.string(),
  inviteeEmail: z.string(),
  status: z.enum(["pending", "accepted", "rejected", "expired"]),
  invitedAt: z.date(),
  expiresAt: z.date(),
});

const getWorkspaceInvitationsParams = z.object({
  workspaceId: z.string(),
});

const getWorkspaceInvitationsResponse = z.object({
  data: z.array(invitation),
  message: z.string(),
  statusCode: z.number(),
});

const getIncomingInvitationsResponse = z.object({
  data: z.array(invitation),
  message: z.string(),
  statusCode: z.number(),
});

const respondInvitationParams = z.object({
  id: z.string(),
});

const respondInvitationPayload = z.object({
  accept: z.boolean(),
});

const respondInvitationResponse = z.object({
  data: invitation,
  message: z.string(),
  statusCode: z.number(),
});

const invite = z.object({
  id: z.string(),
  workspaceId: z.string(),
  workspaceName: z.string(),
  inviterId: z.string(),
  inviterName: z.string(),
  inviterEmail: z.string(),
  inviteeEmail: z.string(),
  status: z.string(),
  invitedAt: z.date(),
  respondedAt: z.date().nullable(),
  expiresAt: z.date(),
});

const invitationActions = {
  create: {
    payload: createInvitationPayload,
    response: {
      ok: cdtoSuccess(
        z.object({
          error: z
            .object({
              code: z.enum([
                "USER_NOT_FOUND",
                "ALREADY_IN_WORKSPACE",
                "ALREADY_INVITE",
              ]),
              message: z.string(),
            })
            .optional(),
          invite: createInvitationResponse.optional(),
        }),
      ),
    },
  },
  getWorkspaceInvitations: {
    params: getWorkspaceInvitationsParams,
    response: {
      ok: cdtoSuccess(getWorkspaceInvitationsResponse),
    },
  },
  readMany: {
    response: {
      ok: cdtoSuccess(
        z.object({
          pending: z.array(invite),
          history: z.array(invite),
        }),
      ),
    },
  },
  respond: {
    params: respondInvitationParams,
    payload: respondInvitationPayload,
    response: {
      ok: cdtoSuccess(respondInvitationResponse),
    },
  },
} as const;

export type InvitationActions = Actions<typeof invitationActions>;

export class CreateInvitationPayloadDto extends createZodDto(
  invitationActions.create.payload,
) {}

export class GetWorkspaceInvitationsParamsDto extends createZodDto(
  invitationActions.getWorkspaceInvitations.params,
) {}

export class RespondInvitationParamsDto extends createZodDto(
  invitationActions.respond.params,
) {}

export class RespondInvitationPayloadDto extends createZodDto(
  invitationActions.respond.payload,
) {}

export class CreateInvitationResponseOkDto extends createZodDto(
  invitationActions.create.response.ok,
) {}

export class GetWorkspaceInvitationsResponseOkDto extends createZodDto(
  invitationActions.getWorkspaceInvitations.response.ok,
) {}

export class ReadManyInvitationsResponseOkDto extends createZodDto(
  invitationActions.readMany.response.ok,
) {}

export class RespondInvitationResponseOkDto extends createZodDto(
  invitationActions.respond.response.ok,
) {}
