import { email, z } from "zod";
import { createZodDto } from "nestjs-zod";
import type { Actions } from "../../types";
import { cdtoSuccess } from "../../helpers";

const userActions = {
  registerUser: {
    payload: z.object({
      fullName: z.string(),
      email: z.string(),
      password: z.string(),
    }),
    response: {
      ok: cdtoSuccess(
        z.object({
          id: z.string(),
          fullName: z.string(),
          email: z.string(),
          password: z.string(),
          isActive: z.boolean(),
          createdAt: z.date(),
          updatedAt: z.date(),
        }),
      ),
    },
  },
  loginUser: {
    payload: z.object({
      email: z.string(),
      password: z.string(),
    }),
    response: {
      ok: cdtoSuccess(
        z.object({
          id: z.string(),
        }),
      ),
    },
  },

  getMe: {
    response: {
      ok: cdtoSuccess(
        z.object({
          id: z.string(),
          email: z.string(),
          fullName: z.string(),
        }),
      ),
    },
  },
} as const;

export type UserActions = Actions<typeof userActions>;

export class UserRegisterResponseOkDto extends createZodDto(
  userActions.registerUser.response.ok,
) {}

export class UserRegisterPayloadDto extends createZodDto(
  userActions.registerUser.payload,
) {}

export class UserLoginResponseOkDto extends createZodDto(
  userActions.loginUser.response.ok,
) {}

export class UserLoginPayloadDto extends createZodDto(
  userActions.loginUser.payload,
) {}

export class UserGetMeResponseOkDTO extends createZodDto(
  userActions.getMe.response.ok,
) {}
