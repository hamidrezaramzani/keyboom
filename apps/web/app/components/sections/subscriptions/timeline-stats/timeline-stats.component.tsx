// app/components/sections/stats/StatsCards.tsx
"use client";

import { Card } from "@/app/components/ui";

interface StatsCardsProps {
  stats: {
    costToDate: number;
    costToEnd: number;
    annualCost: number;
    dailyCost: number;
  };
}

const formatPrice = (price: number) => {
  return price.toLocaleString("fa-IR") + " تومان";
};

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card variant="hover">
        <p className="text-gray-500 text-sm mb-1">هزینه تا به الان</p>
        <p className="text-2xl font-bold text-white">
          {formatPrice(stats.costToDate)}
        </p>
      </Card>
      <Card variant="hover">
        <p className="text-gray-500 text-sm mb-1">هزینه تا پایان تمدید</p>
        <p className="text-2xl font-bold text-white">
          {formatPrice(stats.costToEnd)}
        </p>
      </Card>
      <Card variant="hover">
        <p className="text-gray-500 text-sm mb-1">هزینه سالانه</p>
        <p className="text-2xl font-bold text-white">
          {formatPrice(stats.annualCost)}
        </p>
      </Card>
      <Card variant="hover">
        <p className="text-gray-500 text-sm mb-1">هزینه روزانه</p>
        <p className="text-2xl font-bold text-white">
          {formatPrice(stats.dailyCost)}
        </p>
        <p className="text-xs text-gray-500">(بر اساس قیمت جاری)</p>
      </Card>
    </div>
  );
};
