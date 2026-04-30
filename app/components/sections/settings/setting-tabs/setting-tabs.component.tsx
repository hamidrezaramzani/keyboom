// app/components/sections/settings/SettingsTabs.tsx
"use client";

import { User, Bell, Inbox } from "lucide-react";
import { cn } from "@/app/lib/utils";

export type SettingsTabType = "profile" | "notifications" | "inbox";

interface SettingsTabsProps {
  activeTab: SettingsTabType;
  onTabChange: (tab: SettingsTabType) => void;
}

const tabs = [
  { id: "profile" as const, label: "پروفایل", icon: User },
  { id: "notifications" as const, label: "اطلاع‌رسانی", icon: Bell },
  { id: "inbox" as const, label: "دعوت‌ها", icon: Inbox },
];

export const SettingsTabs = ({ activeTab, onTabChange }: SettingsTabsProps) => {
  return (
    <div className="border-b border-gray-800">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative whitespace-nowrap",
                isActive
                  ? "text-indigo-400"
                  : "text-gray-400 hover:text-gray-300",
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
