import { z } from "zod";
import { createZodDto } from "nestjs-zod";
import type { Actions } from "../../types";
import { cdtoSuccess } from "../../helpers";

const generateCodeResponse = z.object({
  code: z.string(),
  expiresAt: z.string(),
});

const verifyCodePayload = z.object({
  code: z.string(),
});

const verifyCodeResponse = z.object({
  success: z.boolean(),
});

const getBaleStatusResponse = z.object({
  isConnected: z.boolean(),
  baleChatId: z.string().nullable(),
});

const disconnectResponse = z.object({
  success: z.boolean(),
});

const connectBalePayload = z.object({
  code: z.string(),
  baleChatId: z.string(), // اضافه شد
});

const baleActions = {
  generateCode: {
    response: {
      ok: cdtoSuccess(generateCodeResponse),
    },
  },
  verifyCode: {
    payload: verifyCodePayload,
    response: {
      ok: cdtoSuccess(verifyCodeResponse),
    },
  },
  getStatus: {
    response: {
      ok: cdtoSuccess(getBaleStatusResponse),
    },
  },
  disconnect: {
    response: {
      ok: cdtoSuccess(disconnectResponse),
    },
  },
  connectBale: {
    payload: connectBalePayload,
    response: {
      ok: cdtoSuccess(verifyCodeResponse),
    },
  },
} as const;

export type BaleActions = Actions<typeof baleActions>;

export class BaleGenerateCodeResponseOkDto extends createZodDto(
  baleActions.generateCode.response.ok,
) {}

export class BaleVerifyCodePayloadDto extends createZodDto(
  baleActions.verifyCode.payload,
) {}

export class BaleVerifyCodeResponseOkDto extends createZodDto(
  baleActions.verifyCode.response.ok,
) {}

export class BaleGetStatusResponseOkDto extends createZodDto(
  baleActions.getStatus.response.ok,
) {}

export class BaleDisconnectResponseOkDto extends createZodDto(
  baleActions.disconnect.response.ok,
) {}

export class BaleConnectBalePayloadDto extends createZodDto(
  baleActions.connectBale.payload,
) {}
