import { email, z } from "zod";
import { createZodDto } from "nestjs-zod";
import type { Actions } from "../../types";
import { cdtoSuccess } from "../../helpers";

const updateProfilePayload = z.object({
  fullName: z.string().min(2, "نام کامل باید حداقل ۲ کاراکتر باشد"),
});

const changePasswordPayload = z.object({
  currentPassword: z.string().min(1, "رمز عبور فعلی الزامی است"),
  newPassword: z.string().min(6, "رمز عبور جدید باید حداقل ۶ کاراکتر باشد"),
});

const updateProfileResponse = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
});

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
          memberSince: z.string(),
        }),
      ),
    },
  },

  updateProfile: {
    payload: updateProfilePayload,
    response: {
      ok: cdtoSuccess(updateProfileResponse),
    },
  },
  changePassword: {
    payload: changePasswordPayload,
    response: {
      ok: cdtoSuccess(z.object({ success: z.boolean() })),
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

export class UserUpdateProfilePayloadDto extends createZodDto(
  userActions.updateProfile.payload,
) {}

export class UserUpdateProfileResponseOkDto extends createZodDto(
  userActions.updateProfile.response.ok,
) {}

export class UserChangePasswordPayloadDto extends createZodDto(
  userActions.changePassword.payload,
) {}

export class UserChangePasswordResponseOkDto extends createZodDto(
  userActions.changePassword.response.ok,
) {}
