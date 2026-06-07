import { Suspense, lazy } from "react";
import { Navbar, Footer, Hero } from "@/app/components";

const Features = lazy(
  () => import("@/app/components/sections/landing/features/features.component"),
);
const Benefits = lazy(
  () => import("@/app/components/sections/landing/benefits/benefits.component"),
);

function SectionLoading() {
  return (
    <div className="py-20 px-4 flex justify-center items-center">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );
}

function Guide() {
  return (
    <section className="py-20 px-4 bg-gray-950/70">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <span className="inline-flex px-3 py-1 bg-indigo-500/10 rounded-full text-indigo-400 text-xs mb-4">
            راهنمای کی‌بوم
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            مدیریت اشتراک‌ها، هزینه‌ها و تمدیدها در یک داشبورد
          </h2>
          <p className="text-gray-400 leading-8 max-w-3xl mx-auto">
            کی‌بوم برای افرادی ساخته شده که چندین اشتراک ماهانه یا سالانه دارند
            و می‌خواهند قبل از تمدید هر سرویس، مبلغ پرداختی، تاریخ سررسید و
            ارزش واقعی آن را بررسی کنند. با ثبت اشتراک‌ها در کی‌بوم، تصویر
            روشن‌تری از هزینه‌های تکرارشونده به دست می‌آورید و تصمیم‌گیری برای
            تمدید یا لغو سرویس‌ها ساده‌تر می‌شود.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <article className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
            <h3 className="text-xl font-semibold text-white mb-3">
              کی‌بوم چه مشکلی را حل می‌کند؟
            </h3>
            <p className="text-gray-400 leading-8">
              بسیاری از هزینه‌های اشتراکی کوچک به نظر می‌رسند، اما در پایان
              ماه یا سال عدد قابل توجهی می‌شوند. کی‌بوم این پرداخت‌ها را کنار
              هم نمایش می‌دهد، مجموع هزینه‌ها را قابل پیگیری می‌کند و کمک
              می‌کند سرویس‌هایی را که کمتر استفاده می‌کنید سریع‌تر شناسایی
              کنید.
            </p>
          </article>

          <article className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
            <h3 className="text-xl font-semibold text-white mb-3">
              یادآوری تمدید اشتراک چگونه کمک می‌کند؟
            </h3>
            <p className="text-gray-400 leading-8">
              با یادآوری تمدید، قبل از شارژ دوباره یا پایان اعتبار سرویس
              مطلع می‌شوید. این قابلیت برای اشتراک‌های آموزشی، سرگرمی، نرم‌افزار
              و ابزارهای کاری کاربردی است و از تمدیدهای ناخواسته یا فراموشی
              پرداخت‌های مهم جلوگیری می‌کند.
            </p>
          </article>

          <article className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
            <h3 className="text-xl font-semibold text-white mb-3">
              گزارش هزینه‌ها چه اطلاعاتی می‌دهد؟
            </h3>
            <p className="text-gray-400 leading-8">
              گزارش‌های کی‌بوم نشان می‌دهند در هر ماه چه مقدار برای سرویس‌های
              اشتراکی خرج می‌کنید و کدام دسته از سرویس‌ها سهم بیشتری از بودجه
              شما دارند. این داده‌ها برای برنامه‌ریزی مالی شخصی و کنترل
              پرداخت‌های تکرارشونده مفید هستند.
            </p>
          </article>

          <article className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
            <h3 className="text-xl font-semibold text-white mb-3">
              کی‌بوم برای چه کسانی مناسب است؟
            </h3>
            <p className="text-gray-400 leading-8">
              اگر از سرویس‌های فیلم و موسیقی، ابزارهای هوش مصنوعی، نرم‌افزارهای
              کاری، دامنه و هاست، آموزش آنلاین یا هر سرویس دوره‌ای دیگری
              استفاده می‌کنید، کی‌بوم کمک می‌کند همه آن‌ها را منظم، قابل جستجو
              و قابل مدیریت نگه دارید.
            </p>
          </article>
        </div>
      </div>
    </section>
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

      <Guide />

      <Footer />
    </div>
  );
}
