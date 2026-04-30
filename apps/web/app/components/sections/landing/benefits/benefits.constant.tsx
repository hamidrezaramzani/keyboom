import { Benefit, Subscription } from "./benefits.type";

export const benefits: Benefit[] = [
  {
    title: "صرفه‌جویی واقعی",
    description:
      "با دیدن هزینه کل، متوجه می‌شی کدوم اشتراک‌ها واقعاً به کارت میاد",
  },
  {
    title: "کنترل کامل",
    description: "همه اشتراک‌هات رو یه جا ببین و هرکی رو که می‌خوای لغو کن",
  },
  {
    title: "بدون دردسر",
    description: "رابط کاربری ساده و روان، بدون پیچیدگی‌های غیرضروری",
  },
];

export const subscriptions: Subscription[] = [
  { name: "فیلیمو", price: "۳۰,۰۰۰ تومان/ماه" },
  { name: "نواپلی", price: "۲۵,۰۰۰ تومان/ماه" },
  { name: "یوتیوب پریمیوم", price: "۶۰,۰۰۰ تومان/ماه" },
  { name: "اسپاتیفای", price: "۳۵,۰۰۰ تومان/ماه" },
];
