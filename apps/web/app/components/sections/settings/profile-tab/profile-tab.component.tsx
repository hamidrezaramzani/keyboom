// app/components/sections/settings/ProfileTab.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, Input, Button } from "@/app/components";
import { Avatar } from "@/app/components/ui";
import {
  useChangePasswordMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
} from "@/app/services";
import { toast } from "@/app/lib";

const profileSchema = z.object({
  fullName: z.string().min(1, "نام کامل الزامی است"),
  email: z.string().email("ایمیل معتبر وارد کنید"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(4, "رمز عبور فعلی حداقل ۴ کاراکتر"),
    newPassword: z.string().min(4, "رمز عبور جدید حداقل ۴ کاراکتر"),
    confirmPassword: z.string().min(4, "تکرار رمز عبور الزامی است"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز عبور جدید و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export const ProfileTab = () => {
  const { data: user } = useGetMeQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    reset: resetProfile,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName,
      email: user?.email,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleUpdateProfile = async ({ fullName }: ProfileForm) => {
    try {
      await updateProfile({ payload: { fullName } }).unwrap();
      setIsEditingProfile(false);

      toast.success("پروفایل با موفقیت به‌روزرسانی شد");
    } catch (error) {
      console.error(error);
      toast.error("خطا در به روز رسانی پروفایل");
    }
  };

  const handleChangePassword = async ({
    currentPassword,
    newPassword,
  }: PasswordForm) => {
    try {
      await changePassword({
        payload: {
          currentPassword,
          newPassword,
        },
      }).unwrap();

      resetPassword({
        confirmPassword: "",
        currentPassword: "",
        newPassword: "",
      });
      toast.success("رمز عبور با موفقیت تغییر کرد");
      setIsChangingPassword(false);
    } catch (e) {
      const error = e as { data: { passwordIsInvalid: boolean } };
      console.error(error);
      if (error && error.data.passwordIsInvalid) {
        toast.error("رمز عبور فعلی اشتباه است");
        return;
      }
      toast.error("خطا در تغییر رمز عبور");
    }
  };
  useEffect(() => {
    if (user) resetProfile({ fullName: user.fullName, email: user.email });
  }, [resetProfile, user]);

  if (!user) return;

  return (
    <div className="space-y-6 w-full">
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={user.fullName} size="lg" />
          <div>
            <p className="text-white font-medium">{user.fullName}</p>
            <p className="text-gray-500 text-sm mt-2">
              عضو از {user.memberSince}
            </p>
          </div>
        </div>

        {!isEditingProfile ? (
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">نام کامل</p>
              <p className="text-white">{user.fullName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">ایمیل</p>
              <p className="text-white">{user.email}</p>
            </div>
            <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
              ویرایش پروفایل
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleProfileSubmit(handleUpdateProfile)}
            className="space-y-4"
          >
            <Input
              label="نام کامل"
              error={profileErrors.fullName?.message}
              {...registerProfile("fullName")}
            />
            <Input
              label="ایمیل"
              type="email"
              error={profileErrors.email?.message}
              disabled
              {...registerProfile("email")}
            />
            <div className="flex gap-3">
              <Button
                type="submit"
                variant="primary"
                loading={isProfileSubmitting}
              >
                ذخیره تغییرات
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditingProfile(false)}
              >
                انصراف
              </Button>
            </div>
          </form>
        )}
      </Card>

      <Card>
        <h3 className="text-white font-semibold mb-4">تغییر رمز عبور</h3>
        {!isChangingPassword ? (
          <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
            تغییر رمز عبور
          </Button>
        ) : (
          <form
            onSubmit={handlePasswordSubmit(handleChangePassword)}
            className="space-y-4"
          >
            <Input
              label="رمز عبور فعلی"
              type="password"
              placeholder="••••••••"
              error={passwordErrors.currentPassword?.message}
              {...registerPassword("currentPassword")}
            />
            <Input
              label="رمز عبور جدید"
              type="password"
              placeholder="••••••••"
              error={passwordErrors.newPassword?.message}
              {...registerPassword("newPassword")}
            />
            <Input
              label="تکرار رمز عبور جدید"
              type="password"
              placeholder="••••••••"
              error={passwordErrors.confirmPassword?.message}
              {...registerPassword("confirmPassword")}
            />
            <div className="flex gap-3">
              <Button
                type="submit"
                variant="primary"
                loading={isPasswordSubmitting}
              >
                تغییر رمز عبور
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsChangingPassword(false)}
              >
                انصراف
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
