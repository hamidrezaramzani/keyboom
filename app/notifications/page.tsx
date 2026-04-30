"use client";

import { DashboardLayout } from "@/app/components/layout";
import {
  NotificationsHeader,
  NotificationList,
} from "@/app/components/sections/notifications";
import { useState } from "react";

export default function NotificationsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMarkAllAsRead = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <NotificationsHeader
          onMarkAllAsRead={handleMarkAllAsRead}
          unreadCount={5}
        />
        <NotificationList key={refreshKey} />
      </div>
    </DashboardLayout>
  );
}
