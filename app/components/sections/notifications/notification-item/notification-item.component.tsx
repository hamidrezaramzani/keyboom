"use client";

import { cn } from "@/app/lib/utils";
import { Calendar, Bell, AlertTriangle, CreditCard, Users } from "lucide-react";

export type NotificationType =
  | "expiring"
  | "expired"
  | "payment"
  | "invitation"
  | "reminder"
  | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  link?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onClick?: () => void;
}

const typeConfig = {
  expiring: {
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  expired: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
  payment: {
    icon: CreditCard,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  invitation: { icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
  reminder: {
    icon: Calendar,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  system: { icon: Bell, color: "text-purple-400", bg: "bg-purple-500/10" },
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "لحظاتی پیش";
  if (diffMins < 60) return `${diffMins} دقیقه پیش`;
  if (diffHours < 24) return `${diffHours} ساعت پیش`;
  if (diffDays < 7) return `${diffDays} روز پیش`;

  return date.toLocaleDateString("fa-IR");
};

export const NotificationItem = ({
  notification,
  onRead,
  onClick,
}: NotificationItemProps) => {
  const Icon = typeConfig[notification.type].icon;

  const handleClick = () => {
    if (!notification.isRead) {
      onRead(notification.id);
    }
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all",
        "hover:bg-gray-800/50",
        notification.isRead
          ? "bg-transparent"
          : "bg-indigo-500/5 border-r-2 border-indigo-500",
      )}
    >
      <div
        className={cn(
          "p-2 rounded-full shrink-0",
          typeConfig[notification.type].bg,
        )}
      >
        <Icon className={cn("w-4 h-4", typeConfig[notification.type].color)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              "text-sm font-medium",
              notification.isRead ? "text-gray-300" : "text-white",
            )}
          >
            {notification.title}
          </h4>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {formatDate(notification.createdAt)}
          </span>
        </div>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
          {notification.message}
        </p>
      </div>

      {!notification.isRead && (
        <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-2" />
      )}
    </div>
  );
};
