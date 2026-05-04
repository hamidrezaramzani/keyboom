"use client";

import {
  NotificationItem,
  NotificationType,
} from "../notification-item/notification-item.component";
import { EmptyState } from "@/app/components/ui";
import { BellOff } from "lucide-react";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from "@/app/services/notification";

export const NotificationList = () => {
  const { data: notificationsData, refetch } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();

  const notifications = notificationsData?.data || [];

  const handleRead = async (id: string) => {
    await markAsRead({ id });
    refetch();
  };

  const handleNotificationClick = (notification: unknown) => {
    const link = notification.metadata
      ? JSON.parse(notification.metadata)?.link
      : null;
    if (link) {
      // eslint-disable-next-line react-hooks/immutability
      window.location.href = link;
    }
  };

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={BellOff}
        title="هیچ اعلانی وجود ندارد"
        description="وقتی اعلانی دریافت کنید، در اینجا نمایش داده می‌شود"
      />
    );
  }

  return (
    <div className="divide-y divide-gray-800 flex flex-col gap-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={{
            id: notification.id,
            type: notification.type as NotificationType,
            title: notification.title,
            message: notification.message,
            createdAt: new Date(notification.createdAt).toISOString(),
            isRead: notification.isRead,
            link: notification.metadata
              ? JSON.parse(notification.metadata)?.link
              : undefined,
          }}
          onRead={handleRead}
          onClick={() => handleNotificationClick(notification)}
        />
      ))}
    </div>
  );
};
