"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button, AuthCard } from "@/app/components";
import { LoginFormData } from "./login.type";
import { loginSchema } from "./login.schema";
import { useLoginUserMutation } from "@/app/services";
import { toast } from "@/app/lib";
import { useRouter } from "next/navigation";

export const LoginCard = () => {
  const [loginUser] = useLoginUserMutation();

  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (payload: LoginFormData) => {
    try {
      await loginUser({ payload }).unwrap();
      toast.success("خوش آمدید. ورود با موفقیت انجام شد!");
      push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      if (error && (error as { status: number }).status === 401) {
        toast.error("پست الکترونیکی و یا رمز عبور اشتباه است");
        return;
      }
      toast.error("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-zinc-900 to-gray-950 py-12 px-4">
      <AuthCard
        title="خوش اومدی"
        subtitle="برای ورود، پست الکترونیکی و رمز عبور خود را وارد کن"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            {...register("email")}
            name="email"
            type="email"
            label="پست الکترونیکی"
            placeholder="example_user"
            containerClassName="mb-3"
            error={errors.email?.message}
          />

          <Input
            {...register("password")}
            name="password"
            type="password"
            label="رمز عبور"
            placeholder="••••••••"
            error={errors.password?.message}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4 mb-4"
            disabled={isSubmitting}
          >
            <LogIn className="w-4 h-4" />
            {isSubmitting ? "در حال ورود..." : "ورود"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            حساب کاربری نداری؟{" "}
            <Link
              href="/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              ثبت‌نام کن
            </Link>
          </p>
        </div>
      </AuthCard>
    </div>
  );
};
