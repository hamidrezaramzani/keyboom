import moment from 'jalali-moment';

export function toPersianDate(date: Date): string {
  const persianDate = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

  return persianDate.replace(/\//g, '/');
}

export function getMonthName(monthIndex: number): string {
  const months = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];
  return months[monthIndex];
}

export function calculateDaysLeft(endDate: Date): number {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getFaMoment(date: Date) {
  return moment(date).locale('fa');
}
