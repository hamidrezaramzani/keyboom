"use client";

import { useState } from "react";
import {
  NotificationItem,
  NotificationType,
} from "../notification-item/notification-item.component";
import { EmptyState } from "@/app/components/ui";
import { BellOff } from "lucide-react";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  link?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "expiring",
    title: "اشتراک در حال اتمام",
    message: "اشتراک فیلیمو ۳ روز دیگر به اتمام می‌رسد. برای تمدید اقدام کنید.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    link: "/subscriptions/1",
  },
  {
    id: "2",
    type: "invitation",
    title: "دعوت به فضای کاری",
    message: "علی حسینی شما را به فضای کاری «شرکت کیان» دعوت کرده است.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    link: "/settings/inbox",
  },
  {
    id: "3",
    type: "payment",
    title: "پرداخت موفق",
    message:
      "پرداخت اشتراک یوتیوب پریمیوم به مبلغ ۶۵,۰۰۰ تومان با موفقیت انجام شد.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: "4",
    type: "reminder",
    title: "یادآوری تمدید خودکار",
    message: "تمديد خودکار اشتراک ادوبی کریتیو در ۲ روز آینده انجام خواهد شد.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    id: "5",
    type: "expired",
    title: "اشتراک منقضی شد",
    message: "اشتراک نواپلی منقضی شد. برای استفاده دوباره آن را تمدید کنید.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
];

export const NotificationList = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  // const handleMarkAllAsRead = () => {
  //   setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  // };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.link) {
      console.log("Navigate to:", notification.link);
    }
  };

  // const unreadCount = notifications.filter((n) => !n.isRead).length;

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
          notification={notification}
          onRead={handleRead}
          onClick={() => handleNotificationClick(notification)}
        />
      ))}
    </div>
  );
};
