import { Zap } from "lucide-react";
import { Button } from "../../../ui";
import { stats } from "./hero.constant";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 w-full h-screen flex justify-center items-center overflow-hidden">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px]"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-indigo-400">نسخه بتا به زودی</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              مدیریت هوشمند
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
              اشتراک‌های شما
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            دیگه نگران تاریخ تمدید اشتراک‌هات نباش. کی‌بوم بهت یادآوری می‌کنه،
            هزینه‌هات رو نشون میده و کمکت می‌کنه تصمیم بهتری بگیری.
          </p>

          {/* دکمه‌های CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="primary" size="lg" icon>
              شروع کنید
            </Button>
            <Button variant="secondary" size="lg">
              مشاهده دمو
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
