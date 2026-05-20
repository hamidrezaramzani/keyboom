"use client";

import { DashboardLayout } from "@/app/components/layout";
import {
  ProfileTab,
  NotificationsTab,
  InboxTab,
} from "@/app/components/sections/settings";
import { DashboardContentHeader, Tabs } from "../components";
import { Bell, Settings2, User, User2 } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <DashboardContentHeader
        Icon={Settings2}
        title={"تنظیمات"}
        description={"تنظیمات حساب کاربری خود را در این قسمت انجام دهید"}
      />
      <div className="w-full mt-4">
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
