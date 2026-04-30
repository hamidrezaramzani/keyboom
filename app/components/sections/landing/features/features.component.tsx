import { Card } from "../../../ui";
import { colorClasses, features } from "./features.constant";

export default function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            با کی‌بوم چه کارهایی می‌تونید بکنید؟
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            همه چیزهایی که برای مدیریت حرفه‌ای اشتراک‌هات نیاز داری، در یک جا
            جمع شده
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} variant="hover">
              <div
                className={`p-3 ${colorClasses[feature.color]} rounded-xl w-fit mb-4`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
