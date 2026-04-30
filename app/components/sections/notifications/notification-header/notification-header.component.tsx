"use client";

import { Button } from "@/app/components";
import { CheckCheck } from "lucide-react";

interface NotificationsHeaderProps {
  onMarkAllAsRead: () => void;
  unreadCount: number;
}

export const NotificationsHeader = ({
  onMarkAllAsRead,
  unreadCount,
}: NotificationsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6 mt-4">
      <div>
        <h1 className="text-2xl font-bold text-white">اعلان‌ها</h1>
        <p className="text-gray-400 text-sm mt-1">
          {unreadCount > 0
            ? `${unreadCount} اعلان خوانده نشده دارید`
            : "همه اعلان‌ها خوانده شده است"}
        </p>
      </div>
      {unreadCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          icon={<CheckCheck className="w-4 h-4" />}
          onClick={onMarkAllAsRead}
        >
          علامت زدن همه به عنوان خوانده
        </Button>
      )}
    </div>
  );
};
