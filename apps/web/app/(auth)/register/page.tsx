"use client";

import { Navbar, Footer, RegisterCard } from "@/app/components";

export default function RegisterPage() {
  return (
    <div>
      <Navbar />
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-zinc-900 to-gray-950 py-12 px-4">
        <RegisterCard />
      </div>
      <Footer />
    </div>
  );
}
