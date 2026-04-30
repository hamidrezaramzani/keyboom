// app/components/sections/dashboard/StatsCards.tsx
"use client";

import { Package, CheckCircle, Calendar, TrendingUp } from "lucide-react";
import { Card } from "@/app/components/ui";
import { cn } from "@/app/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => (
  <Card>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && (
          <p className={cn(
            "text-xs mt-2",
            trend.isPositive ? "text-emerald-400" : "text-red-400"
          )}>
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% نسبت به ماه قبل
          </p>
        )}
      </div>
      <div className="p-2 bg-indigo-500/10 rounded-lg shrink-0">
        {icon}
      </div>
    </div>
  </Card>
);

interface StatsCardsProps {
  data: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    monthlyCost: number;
    yearlyCost: number;
    monthlyTrend?: number;
    yearlyTrend?: number;
  };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("fa-IR").format(value) + " تومان";
};

export const StatsCards = ({ data }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="کل اشتراک‌ها"
        value={data.totalSubscriptions}
        icon={<Package className="w-5 h-5 text-indigo-400" />}
      />
      <StatCard
        title="اشتراک‌های فعال"
        value={data.activeSubscriptions}
        icon={<CheckCircle className="w-5 h-5 text-emerald-400" />}
        trend={data.monthlyTrend ? { value: data.monthlyTrend, isPositive: false } : undefined}
      />
      <StatCard
        title="هزینه ماهانه"
        value={formatCurrency(data.monthlyCost)}
        icon={<Calendar className="w-5 h-5 text-amber-400" />}
      />
      <StatCard
        title="هزینه سالانه"
        value={formatCurrency(data.yearlyCost)}
        icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
      />
    </div>
  );
};