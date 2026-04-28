import { Suspense, lazy } from "react";
import { Navbar, Footer, Hero } from "@/app/components";

const Features = lazy(
  () => import("@/app/components/sections/features/features.component"),
);
const Benefits = lazy(
  () => import("@/app/components/sections/benefits/benefits.component"),
);

function SectionLoading() {
  return (
    <div className="py-20 px-4 flex justify-center items-center">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-zinc-900 to-gray-950">
      <Navbar />
      <Hero />

      <Suspense fallback={<SectionLoading />}>
        <Features />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <Benefits />
      </Suspense>

      <Footer />
    </div>
  );
}
