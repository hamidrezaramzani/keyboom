import jalaliMoment from "jalali-moment";

export const jalaliMonths: Record<string, string> = {
  Farvardin: "فروردین",
  Ordibehesht: "اردیبهشت",
  Khordaad: "خرداد",
  Tir: "تیر",
  Mordad: "مرداد",
  Shahrivar: "شهریور",
  Mehr: "مهر",
  Aban: "آبان",
  Azar: "آذر",
  Dey: "دی",
  Bahman: "بهمن",
  Esfand: "اسفند",
};

export const getJalaliMonthFa = (timestamp: number) => {
  const monthEn = jalaliMoment(timestamp).format("jMMMM");
  return jalaliMonths[monthEn] ?? monthEn;
};
