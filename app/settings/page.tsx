"use client";

import { useState } from "react";
import { DashboardLayout } from "@/app/components/layout";
import {
  SettingsTabs,
  ProfileTab,
  NotificationsTab,
  InboxTab,
} from "@/app/components/sections/settings";

type TabType = "profile" | "notifications" | "inbox";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 mt-4">
          <h1 className="text-2xl font-bold text-white">تنظیمات</h1>
          <p className="text-gray-400 text-sm mt-1">
            مدیریت حساب کاربری و تنظیمات اعلان‌ها
          </p>
        </div>

        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "inbox" && <InboxTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}
