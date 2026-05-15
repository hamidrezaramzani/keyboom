"use client";

import { useParams } from "next/navigation";
import { DashboardLayout } from "@/app/components/layout";
import {
  useGetSubscriptionStatsQuery,
  useGetSubscriptionTimelineQuery,
} from "@/app/services/subscription/api-subscription.endpoint";
import { StatsCards, TimelineView } from "@/app/components";

export default function SubscriptionStatsPage() {
  const params = useParams();
  const subscriptionId = params.id as string;

  const { data: stats, isLoading: statsLoading } = useGetSubscriptionStatsQuery(
    {
      params: { subscriptionId },
    },
  );

  const { data: timeline, isLoading: timelineLoading } =
    useGetSubscriptionTimelineQuery({
      params: { subscriptionId },
    });

  if (statsLoading || timelineLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-gray-500">
          در حال بارگذاری...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">اطلاعات آماری</h2>
        </div>

        {stats && <StatsCards stats={stats} />}

        {timeline && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">تایم لاین</h2>
            <TimelineView groups={timeline.groups} items={timeline.items} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
