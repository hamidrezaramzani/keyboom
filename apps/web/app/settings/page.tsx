"use client";

import { DashboardLayout } from "@/app/components/layout";
import {
  ProfileTab,
  NotificationsTab,
  InboxTab,
} from "@/app/components/sections/settings";
import { Tabs } from "../components";
import { Bell, User, User2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 mt-4">
          <h1 className="text-2xl font-bold text-white">تنظیمات</h1>
          <p className="text-gray-400 text-sm mt-1">
            مدیریت حساب کاربری و تنظیمات اعلان‌ها
          </p>
        </div>

        <Tabs
          tabs={[
            {
              id: "profile",
              icon: User,
              label: "پروفایل کاربری",
              content: <ProfileTab />,
            },
            {
              id: "notifications",
              icon: Bell,
              label: "اطلاع رسانی",
              content: <NotificationsTab />,
            },
            {
              id: "inbox",
              icon: User2,
              label: "دعوت ها",
              content: <InboxTab />,
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
