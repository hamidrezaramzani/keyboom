// app/components/sections/settings/ProfileTab.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, Input, Button } from "@/app/components";
import { Avatar } from "@/app/components/ui";

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

const mockUser = {
  fullName: "علی حسینی",
  email: "ali@example.com",
  avatar: null,
  memberSince: "۱۴۰۳/۰۱/۱۵",
};

export const ProfileTab = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: mockUser.fullName,
      email: mockUser.email,
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

  const onProfileSubmit = async (data: ProfileForm) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Update profile:", data);
    setIsEditingProfile(false);
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Change password:", data);
    resetPassword();
    setIsChangingPassword(false);
  };

  const handleDeleteAccount = async () => {
    if (
      confirm("آیا از حذف حساب خود مطمئن هستید؟ این عمل غیرقابل بازگشت است.")
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Delete account");
    }
  };

  return (
    <div className="space-y-6 w-full">
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={mockUser.fullName} src={mockUser.avatar} size="lg" />
          <div>
            <p className="text-white font-medium">{mockUser.fullName}</p>
            <p className="text-gray-500 text-sm">
              عضو از {mockUser.memberSince}
            </p>
          </div>
        </div>

        {!isEditingProfile ? (
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">نام کامل</p>
              <p className="text-white">{mockUser.fullName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">ایمیل</p>
              <p className="text-white">{mockUser.email}</p>
            </div>
            <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
              ویرایش پروفایل
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleProfileSubmit(onProfileSubmit)}
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
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
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

      <Card>
        <h3 className="text-white font-semibold mb-4 text-red-400">
          حذف حساب کاربری
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          با حذف حساب کاربری، تمام داده‌های شما برای همیشه حذف می‌شود. این عمل
          قابل بازگشت نیست.
        </p>
        <Button variant="danger" onClick={handleDeleteAccount}>
          حذف حساب کاربری
        </Button>
      </Card>
    </div>
  );
};
