"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Input, Button, AuthCard, Navbar, Footer } from "@/app/components";

export default function RegisterPage() {
  return (
    <div>
      <Navbar />
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-zinc-900 to-gray-950 py-12 px-4">
        <AuthCard
          title="ساخت حساب کاربری 🚀"
          subtitle="برای شروع، اطلاعات زیر رو وارد کن"
        >
          <form className="space-y-4">
            <Input
              name="fullName"
              type="text"
              label="نام و نام خانوادگی"
              placeholder="علی حسینی"
              containerClassName="mb-3"
            />

            <Input
              name="username"
              type="text"
              label="نام کاربری"
              placeholder="ali_hosseini"
              containerClassName="mb-3"
            />

            <Input
              name="password"
              type="password"
              label="رمز عبور"
              placeholder="••••••••"
              containerClassName="mb-3"
            />

            <Input
              name="confirmPassword"
              type="password"
              label="تکرار رمز عبور"
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4 mb-4"
            >
              <UserPlus className="w-4 h-4" />
              ثبت‌نام
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
      </div>
      <Footer />
    </div>
  );
}
