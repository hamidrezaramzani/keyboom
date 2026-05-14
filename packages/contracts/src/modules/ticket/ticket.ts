import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import type { Actions } from "../../types";
import { cdtoSuccess } from "../../helpers";

const ticketStatus = z.enum(["open", "in_progress", "answered", "closed"]).or(z.string());
const ticketPriority = z.enum(["low", "medium", "high"]);
const ticketCategory = z.enum(["subscription", "workspace", "general"]);

const ticket = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  status: ticketStatus,
  priority: ticketPriority,
  category: ticketCategory,
  createdAt: z.date(),
  updatedAt: z.date(),
});

const ticketMessage = z.object({
  id: z.string(),
  ticketId: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  senderIsAdmin: z.boolean(),
  message: z.string(),
  isRead: z.boolean(),
  createdAt: z.date(),
});

const createTicketPayload = z.object({
  title: z.string().min(1, "Title is required"),
  priority: ticketPriority.default("medium"),
  category: ticketCategory.default("general"),
  message: z.string().min(1, "Message is required"),
});

const addMessagePayload = z.object({
  message: z.string().min(1, "Message is required"),
});

const ticketActions = {
  create: {
    payload: createTicketPayload,
    response: {
      ok: cdtoSuccess(ticket),
    },
  },
  readMany: {
    query: z.object({
      status: ticketStatus.optional(),
      priority: ticketPriority.optional(),
      category: ticketCategory.optional(),
      search: z.string().optional(),
    }),
    response: {
      ok: cdtoSuccess(z.array(ticket)),
    },
  },
  readOne: {
    params: z.object({
      ticketId: z.string(),
    }),
    response: {
      ok: cdtoSuccess(
        z.object({
          ticket,
          messages: z.array(ticketMessage),
        }),
      ),
    },
  },
  addMessage: {
    params: z.object({
      ticketId: z.string(),
    }),
    payload: addMessagePayload,
    response: {
      ok: cdtoSuccess(ticketMessage),
    },
  },
  close: {
    params: z.object({
      ticketId: z.string(),
    }),
    response: {
      ok: cdtoSuccess(z.object({ success: z.boolean() })),
    },
  },
} as const;

export type TicketActions = Actions<typeof ticketActions>;

export class TicketCreatePayloadDto extends createZodDto(
  ticketActions.create.payload,
) {}
export class TicketCreateResponseOkDto extends createZodDto(
  ticketActions.create.response.ok,
) {}
export class TicketReadManyQueryDto extends createZodDto(
  ticketActions.readMany.query,
) {}
export class TicketReadManyResponseOkDto extends createZodDto(
  ticketActions.readMany.response.ok,
) {}
export class TicketReadOneParamsDto extends createZodDto(
  ticketActions.readOne.params,
) {}
export class TicketReadOneResponseOkDto extends createZodDto(
  ticketActions.readOne.response.ok,
) {}
export class TicketAddMessageParamsDto extends createZodDto(
  ticketActions.addMessage.params,
) {}
export class TicketAddMessagePayloadDto extends createZodDto(
  ticketActions.addMessage.payload,
) {}
export class TicketAddMessageResponseOkDto extends createZodDto(
  ticketActions.addMessage.response.ok,
) {}
export class TicketCloseParamsDto extends createZodDto(
  ticketActions.close.params,
) {}
export class TicketCloseResponseOkDto extends createZodDto(
  ticketActions.close.response.ok,
) {}
