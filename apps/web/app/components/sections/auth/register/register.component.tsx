"use client";
import { AuthCard, Button, Input } from "@/app/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { RegisterFormData } from "./register.type";
import { registerSchema } from "./register.schema";
import { useRegisterUserMutation } from "@/app/services";
import { toast } from "@/app/lib";
import { useRouter } from "next/navigation";

export const RegisterCard = () => {
  const [registerUser] = useRegisterUserMutation();
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({ payload: data }).unwrap();
      toast.success("تبریک، ثبت نام با موفقیت انجام شد");
      push("/login");
    } catch (error) {
      toast.error("خطایی پیش آمده است، لطفا مجدد تلاش کنید");
      console.error("Registration error:", error);
    }
  };

  return (
    <AuthCard
      title="ساخت حساب کاربری"
      subtitle="برای شروع، اطلاعات زیر رو وارد کن"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("fullName")}
          name="fullName"
          type="text"
          label="نام و نام خانوادگی"
          placeholder="حمیدرضا رمضانی"
          containerClassName="mb-3"
          error={errors.fullName?.message}
        />

        <Input
          {...register("email")}
          name="email"
          type="email"
          label="پست الکترونیکی"
          placeholder="example@email.com"
          containerClassName="mb-3"
          error={errors.email?.message}
        />

        <Input
          {...register("password")}
          name="password"
          type="password"
          label="رمز عبور"
          placeholder="••••••••"
          containerClassName="mb-3"
          error={errors.password?.message}
        />

        <Input
          {...register("confirmPassword")}
          name="confirmPassword"
          type="password"
          label="تکرار رمز عبور"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-4 mb-4"
          disabled={isSubmitting}
        >
          <UserPlus className="w-4 h-4" />
          {isSubmitting ? "در حال ثبت‌نام..." : "ثبت‌نام"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          قبلاً ثبت‌نام کردی؟{" "}
          <Link
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            وارد شو
          </Link>
        </p>
      </div>
    </AuthCard>
  );
};
