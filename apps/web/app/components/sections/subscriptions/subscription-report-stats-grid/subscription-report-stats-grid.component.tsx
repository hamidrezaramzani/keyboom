import { DollarSign, CreditCard, RefreshCw, CalendarClock } from "lucide-react";
import { SubscriptionReportStatsCard } from "../subscription-report-stats-card/subscription-report-stats-card.component";

interface StatsGridProps {
  totalSpent: number;
  currentPrice: number;
  renewalCount: number;
  remainingDays: number;
}

export function SubscriptionReportStatsGrid({
  totalSpent,
  currentPrice,
  renewalCount,
  remainingDays,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <SubscriptionReportStatsCard
        title="مجموع هزینه"
        titleBadge="تا به امروز"
        value={`${totalSpent.toLocaleString()} تومان`}
        icon={DollarSign}
        color="text-emerald-400"
      />
      <SubscriptionReportStatsCard
        title="قیمت فعلی"
        titleBadge="ماهانه"
        value={`${currentPrice.toLocaleString()} تومان`}
        icon={CreditCard}
      />
      <SubscriptionReportStatsCard
        title="تعداد تمدید"
        value={renewalCount}
        icon={RefreshCw}
      />
      <SubscriptionReportStatsCard
        title="روزهای باقی‌مانده"
        value={`${remainingDays} روز`}
        icon={CalendarClock}
        color="text-amber-400"
      />
    </div>
  );
}
