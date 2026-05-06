"use client";

import { DashboardLayout } from "@/app/components/layout";
import {
  NotificationsHeader,
  NotificationList,
} from "@/app/components/sections/notifications";
import { useState } from "react";
import {
  useGetUnreadCountQuery,
  useMarkAllAsReadMutation,
} from "../services/notification";
import { toast } from "../lib";

export default function NotificationsPage() {
  const { data: unreadCountData } = useGetUnreadCountQuery();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const unreadCount = unreadCountData?.count || 0;

  const [refreshKey, setRefreshKey] = useState(0);

  const handleMarkAllAsRead = async () => {
    try {
      setRefreshKey((prev) => prev + 1);
      await markAllAsRead().unwrap();
      toast.success("علامت زدن تمامی اطلاع رسانی ها با موفقیت انجام شد");
    } catch (error) {
      console.error(error);
      toast.error("خطا هنگام علامت زدن تمامی اطلاع رسانی ها");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <NotificationsHeader
          onMarkAllAsRead={handleMarkAllAsRead}
          unreadCount={unreadCount}
        />
        <NotificationList key={refreshKey} />
      </div>
    </DashboardLayout>
  );
}
