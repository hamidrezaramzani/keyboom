"use client";

import { useState } from "react";
import { DashboardLayout } from "@/app/components/layout";
import {
  AICard,
  StatsCards,
  RecentSubscriptions,
  ExpiringSoon,
  MonthlyChart,
} from "@/app/components/sections/dashboard";
import { AddSubscriptionModal } from "../components/sections/subscriptions/add-subscription-modal/add-subscription-modal.component";
import { SubscriptionModal } from "../components/sections/subscriptions/subscription-modal/subscription-modal.component";

const mockStats = {
  totalSubscriptions: 12,
  activeSubscriptions: 8,
  monthlyCost: 380000,
  yearlyCost: 4560000,
  monthlyTrend: 12,
};

const mockRecentSubscriptions = [
  {
    id: "1",
    name: "فیلیمو",
    price: 59000,
    status: "active" as const,
    endDate: "2025-01-15",
  },
  {
    id: "2",
    name: "نواپلی",
    price: 35000,
    status: "expiring" as const,
    endDate: "2025-01-10",
  },
  {
    id: "3",
    name: "یوتیوب",
    price: 65000,
    status: "active" as const,
    endDate: "2025-01-20",
  },
  {
    id: "4",
    name: "اسپاتیفای",
    price: 45000,
    status: "active" as const,
    endDate: "2025-01-25",
  },
  {
    id: "5",
    name: "ادوبی",
    price: 180000,
    status: "expiring" as const,
    endDate: "2025-01-08",
  },
];

const mockExpiring = [
  { id: "1", name: "نواپلی", daysLeft: 3 },
  { id: "2", name: "ادوبی", daysLeft: 5 },
];

const mockChartData = [
  { month: "مرداد", cost: 320000 },
  { month: "شهریور", cost: 350000 },
  { month: "مهر", cost: 380000 },
  { month: "آبان", cost: 370000 },
  { month: "آذر", cost: 390000 },
  { month: "دی", cost: 380000 },
];

const aiMessage =
  "سلام {name} جان! این ماه ۳۸۰ هزار تومان خرج اشتراک کردی، ۱۲٪ بیشتر از ماه قبل. دلیل اصلی اضافه شدن فیلیمو هست.";

export default function DashboardPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    string | null
  >(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  const handleSubscriptionClick = (id: string) => {
    setSelectedSubscriptionId(id);
    setIsSubscriptionModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <AICard message={aiMessage} userName="علی" />
        <StatsCards data={mockStats} />

        <div className="grid lg:grid-cols-2 gap-6">
          <RecentSubscriptions
            subscriptions={mockRecentSubscriptions}
            onSubscriptionClick={handleSubscriptionClick}
            onViewAll={() => console.log("view all")}
          />
          <ExpiringSoon
            subscriptions={mockExpiring}
            onRenew={(id) => console.log("Renew", id)}
          />
        </div>

        <MonthlyChart data={mockChartData} />
      </div>

      <AddSubscriptionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        subscriptionId={selectedSubscriptionId}
      />
    </DashboardLayout>
  );
}
