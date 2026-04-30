// app/components/sections/dashboard/RecentSubscriptions.tsx
"use client";

import { Calendar } from "lucide-react";
import { Card, Badge } from "@/app/components/ui";

interface Subscription {
  id: string;
  name: string;
  price: number;
  status: "active" | "expiring" | "expired";
  endDate: string;
}

interface RecentSubscriptionsProps {
  subscriptions: Subscription[];
  onViewAll?: () => void;
  onSubscriptionClick?: (id: string) => void;
}

const statusConfig = {
  active: { label: "فعال", variant: "success" as const },
  expiring: { label: "در شرف اتمام", variant: "warning" as const },
  expired: { label: "منقضی", variant: "danger" as const },
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fa-IR");
};

const formatPrice = (price: number) => {
  return price.toLocaleString("fa-IR") + " تومان";
};

export const RecentSubscriptions = ({
  subscriptions,
  onViewAll,
  onSubscriptionClick,
}: RecentSubscriptionsProps) => {
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">آخرین اشتراک‌ها</h3>
        <button
          onClick={onViewAll}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          مشاهده همه
        </button>
      </div>

      <div className="space-y-3">
        {subscriptions.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onSubscriptionClick?.(sub.id)}
            className="w-full flex items-center justify-between p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors text-right"
          >
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{sub.name}</p>
              <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                {formatDate(sub.endDate)}
              </p>
            </div>
            <div className="text-left shrink-0 mr-4">
              <p className="text-white whitespace-nowrap">
                {formatPrice(sub.price)}
              </p>
              <Badge variant={statusConfig[sub.status].variant} size="sm">
                {statusConfig[sub.status].label}
              </Badge>
            </div>
          </button>
        ))}

        {subscriptions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            هنوز اشتراکی اضافه نکردی
          </div>
        )}
      </div>
    </Card>
  );
};
