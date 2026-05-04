"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, BellOff, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  NotificationItem,
  NotificationType,
} from "@/app/components/sections/notifications";
import {
  useGetRecentNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  Notification,
} from "@/app/services/notification";

export const NotificationPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const { data: recentData, refetch: refetchRecent } =
    useGetRecentNotificationsQuery();
  const { data: unreadCountData, refetch: refetchUnreadCount } =
    useGetUnreadCountQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = recentData?.data || [];
  const unreadCount = unreadCountData?.data?.count || 0;

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

  const handleRead = async (id: string) => {
    await markAsRead({ id });
    refetchRecent();
    refetchUnreadCount();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    refetchRecent();
    refetchUnreadCount();
  };

  const handleNotificationClick = (notification: Notification) => {
    const link = notification.metadata
      ? JSON.parse(notification.metadata)?.link
      : null;
    if (link) {
      router.push(link);
      setIsOpen(false);
    }
  };

  const handleViewAll = () => {
    router.push("/notifications");
    setIsOpen(false);
  };

  const formatNotificationCount = (count: number): string => {
    if (count > 99) {
      return "+99";
    }
    return count.toString();
  };

  const countLabel = formatNotificationCount(unreadCount);

  return (
    <div className="relative z-50">
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />

        {unreadCount > 0 && (
          <div className="absolute flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-danger border-2 border-buffer rounded-full -top-1 -start-1">
            <span>{countLabel}</span>
          </div>
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
                onClick={handleMarkAllAsRead}
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
              notifications.slice(0, 5).map((notification) => (
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
