"use client";

import { DashboardLayout } from "@/app/components/layout";
import { useParams } from "next/navigation";
import { useGetSubscriptionReportQuery } from "@/app/services/subscription";
import {
  EmptyState,
  SubscriptionReportCostChart,
  SubscriptionReportHeader,
  SubscriptionReportSkeletonLoading,
  SubscriptionReportStatsGrid,
} from "@/app/components";
import { TriangleAlert } from "lucide-react";

export default function SubscriptionStatsPage() {
  const params = useParams();
  const subscriptionId = params.id as string;

  const {
    data: subscription,
    isLoading,
    error,
  } = useGetSubscriptionReportQuery({
    params: { subscriptionId },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <SubscriptionReportSkeletonLoading />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <EmptyState icon={TriangleAlert} title="خطا در بارگذاری" />
      </DashboardLayout>
    );
  }

  if (!subscription) return null;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 vazir rtl">
        {!isLoading && !error && (
          <>
            <SubscriptionReportHeader
              name={subscription.name}
              status={subscription.status}
              groupName={subscription.groupName}
              startDate={subscription.startDate}
              endDate={subscription.endDate}
              countdown={subscription.countdown}
            />

            <SubscriptionReportStatsGrid
              totalSpent={subscription.totalSpent}
              currentPrice={subscription.currentPrice}
              renewalCount={subscription.renewalCount}
              remainingDays={subscription.remainingDays}
            />

            <SubscriptionReportCostChart
              data={subscription.costOverTime}
              currentPrice={subscription.currentPrice}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
