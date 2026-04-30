// app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import { LogIn, User, Lock } from "lucide-react";
import { Input, Button, AuthCard, Navbar, Footer } from "@/app/components";

export default function LoginPage() {
  return (
    <div>
      <Navbar />
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-zinc-900 to-gray-950 py-12 px-4">
        <AuthCard
          title="خوش اومدی 👋"
          subtitle="برای ورود، نام کاربری و رمز عبور خود را وارد کن"
        >
          <form className="space-y-5">
            <Input
              name="username"
              type="text"
              label="نام کاربری"
              placeholder="example_user"
              containerClassName="mb-3"
            />

            <Input
              name="password"
              type="password"
              label="رمز عبور"
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4 mb-4"
            >
              <LogIn className="w-4 h-4" />
              ورود
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
      <Footer />
    </div>
  );
}
