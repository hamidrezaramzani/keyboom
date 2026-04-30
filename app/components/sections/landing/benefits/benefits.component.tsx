import { CheckCircle } from "lucide-react";
import { Card } from "../../../ui";
import { benefits, subscriptions } from "./benefits.constant";

export default function Benefits() {
  return (
    <section id="benefits" className="py-20 px-4 bg-gray-900/30">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* سمت راست */}
          <div>
            <div className="inline-flex px-3 py-1 bg-indigo-500/10 rounded-full text-indigo-400 text-xs mb-4">
              مزایا
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              چرا کی‌بوم رو انتخاب کنیم؟
            </h2>
            <p className="text-gray-400 mb-6">
              توی دنیایی که همه چیز اشتراکی شده، مدیریت هزینه‌ها و تاریخ‌ها
              می‌تونه سردرگم کننده باشه. کی‌بوم این مشکل رو برات حل می‌کنه.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium">{benefit.title}</h4>
                    <p className="text-gray-500 text-sm">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* سمت چپ - دمو */}
          <div className="relative">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-medium">اشتراک‌های فعال</span>
                <span className="text-indigo-400 text-sm">
                  ماه جاری: ۳۲۵,۰۰۰ تومان
                </span>
              </div>
              <div className="space-y-3">
                {subscriptions.map((sub, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl"
                  >
                    <span className="text-gray-300">{sub.name}</span>
                    <span className="text-gray-400 text-sm">{sub.price}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
