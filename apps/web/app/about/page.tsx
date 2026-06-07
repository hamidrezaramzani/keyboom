import { Target, Sparkles, Shield, Compass } from "lucide-react";
import { Footer, Navbar } from "../components";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-zinc-900 to-gray-950">
      <Navbar />
      <div className="relative pt-24 pb-12 px-4 overflow-hidden ">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px]"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-indigo-400">داستان ما</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              درباره کی‌بوم
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            کی‌بوم از یه مشکل شخصی شروع شد: «واقعاً ماهی چقدر برای اشتراک‌ها پول
            می‌دم؟»
          </p>
        </div>
      </div>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
            ارزش‌های ما
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            چیزی که کی‌بوم رو از بقیه متمایز می‌کنه
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900/30 rounded-xl p-6 text-center border border-gray-800">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">شفافیت</h3>
              <p className="text-gray-400 text-sm">
                هیچ داده‌ای از کاربران رو نمی‌فروشیم. حریم شخصی خط قرمز ماست.
              </p>
            </div>

            <div className="bg-gray-900/30 rounded-xl p-6 text-center border border-gray-800">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">سادگی</h3>
              <p className="text-gray-400 text-sm">
                چیزی که پیچیده باشه، کسی استفاده نمی‌کنه. برای همین محصول رو
                ساده طراحی کردیم.
              </p>
            </div>

            <div className="bg-gray-900/30 rounded-xl p-6 text-center border border-gray-800">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                تأثیر واقعی
              </h3>
              <p className="text-gray-400 text-sm">
                هدف ما اینه که کاربرامون واقعاً توی هزینه‌هاشون صرفه‌جویی کنن.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            دوست داری چت کنیم؟
          </h2>
          <p className="text-gray-400 mb-8">
            اگه سوال، پیشنهاد، یا انتقادی داری، خوشحال می‌شیم بشنویم.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hamidrezaramzani80@gmail.com"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-medium transition-all duration-200"
            >
              ایمیل
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
