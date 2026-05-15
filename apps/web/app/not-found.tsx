import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "صفحه پیدا نشد | 404",
  description: "متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد",
};

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] animate-pulse animation-delay-400" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-400/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        <div className="mb-8 relative">
          <h1 className="text-[180px] sm:text-[220px] md:text-[280px] font-bold leading-none tracking-tighter select-none">
            <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent animate-fade-in-up">
              4
            </span>
            <span className="bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 bg-clip-text text-transparent animate-fade-in-up animation-delay-200 inline-block mx-2 sm:mx-4">
              0
            </span>
            <span className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-400 bg-clip-text text-transparent animate-fade-in-up animation-delay-400">
              4
            </span>
          </h1>

          {/* Decorative floating elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-primary-500/20 animate-ping opacity-30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-primary-500/30 animate-pulse" />
        </div>

        {/* Title & Description */}
        <div className="space-y-4 mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white animate-fade-in-up animation-delay-200">
            صفحه‌ای که به دنبال آن هستید
          </h2>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white animate-fade-in-up animation-delay-300">
            پیدا نشد!
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto animate-fade-in-up animation-delay-400">
            متأسفیم، اما صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابه‌جا شده
            است. لطفاً آدرس را بررسی کنید یا به صفحه اصلی بازگردید.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
          <Link
            href="/"
            className="btn-primary btn-lg px-8 py-3 text-base inline-flex items-center gap-2 group"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            بازگشت به صفحه اصلی
          </Link>

          <Link
            href="/dashboard"
            className="btn-outline btn-lg px-8 py-3 text-base inline-flex items-center gap-2 group"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            داشبورد
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 animate-fade-in-up animation-delay-800">
          <p className="text-gray-500 text-sm mb-4">
            یا می‌توانید از این صفحات دیدن کنید:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
            <Link
              href="/about"
              className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
            >
              درباره ما
            </Link>
            <span className="text-gray-700">•</span>
            <Link
              href="/contact"
              className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
            >
              تماس با ما
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
