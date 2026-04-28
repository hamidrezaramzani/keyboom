import { BadgePlus, BellRing, ChartLine } from "lucide-react";
import { Feature, FeatureColor } from "./features.type";

export const features: Feature[] = [
  {
    icon: BadgePlus,
    title: "ثبت آسان اشتراک",
    description:
      "با چند کلیک ساده اشتراک جدید رو اضافه کن. فقط کافیه نام، مبلغ و تاریخ رو وارد کنی.",
    color: "indigo",
  },
  {
    icon: BellRing,
    title: "یادآوری هوشمند",
    description:
      "قبل از هر تمدیدی بهت یادآوری می‌کنیم. دیگه هیچ اشتراکی بدون اطلاع تو تمدید نمیشه.",
    color: "emerald",
  },
  {
    icon: ChartLine,
    title: "گزارشات پیشرفته",
    description:
      "نمودارهای تحلیلی از هزینه‌های ماهانه و سالانه. ببین کجا بیشترین خرج رو می‌کنی.",
    color: "amber",
  },
];

export const colorClasses: Record<FeatureColor, string> = {
  indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
};
