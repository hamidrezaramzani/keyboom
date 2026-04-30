// app/components/ui/NotificationPopover.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, BellOff, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { NotificationItem } from "@/app/components/sections/notifications";

interface Notification {
  id: string;
  type:
    | "expiring"
    | "expired"
    | "payment"
    | "invitation"
    | "reminder"
    | "system";
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
    message: "اشتراک فیلیمو ۳ روز دیگر به اتمام می‌رسد.",
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
    message: "پرداخت اشتراک یوتیوب پریمیوم انجام شد.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
];

export const NotificationPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.link) {
      router.push(notification.link);
      setIsOpen(false);
    }
  };

  const handleViewAll = () => {
    router.push("/notifications");
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute left-0 mt-2 w-96 bg-gray-800 rounded-xl border border-gray-700 shadow-lg z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">اعلان‌ها</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => {
                  setNotifications(
                    notifications.map((n) => ({ ...n, isRead: true })),
                  );
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                علامت زدن همه به عنوان خوانده
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto flex flex-col gap-3 p-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <BellOff className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">هیچ اعلانی وجود ندارد</p>
              </div>
            ) : (
              notifications
                .slice(0, 5)
                .map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={handleRead}
                    onClick={() => handleNotificationClick(notification)}
                  />
                ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-700">
              <button
                onClick={handleViewAll}
                className="w-full text-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-1"
              >
                <span>مشاهده همه اعلان‌ها</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
