"use client";

import { Navbar, Footer, LoginCard } from "@/app/components";

export default function LoginPage() {
  return (
    <div>
      <Navbar />
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-zinc-900 to-gray-950 py-12 px-4">
        <LoginCard />
      </div>
      <Footer />
    </div>
  );
}
