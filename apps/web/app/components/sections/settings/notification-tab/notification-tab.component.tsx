// app/components/sections/settings/NotificationsTab.tsx
"use client";

import { useState } from "react";
import { Card, Button } from "@/app/components";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const defaultSettings: NotificationSetting[] = [
  {
    id: "browser",
    title: "نوتیفیکیشن مرورگر",
    description: "دریافت نوتیفیکیشن در مرورگر حتی وقتی کی‌بوم باز نیست",
    enabled: true,
  },
  {
    id: "email",
    title: "یادآوری ایمیلی",
    description: "دریافت یادآوری تمدید اشتراک از طریق ایمیل",
    enabled: false,
  },
  {
    id: "expiring_3days",
    title: "یادآوری ۳ روز قبل",
    description: "دریافت یادآوری ۳ روز قبل از اتمام اشتراک",
    enabled: true,
  },
  {
    id: "expiring_7days",
    title: "یادآوری ۷ روز قبل",
    description: "دریافت یادآوری ۷ روز قبل از اتمام اشتراک",
    enabled: false,
  },
];

const reminderOptions = [
  { value: "1", label: "۱ روز قبل" },
  { value: "3", label: "۳ روز قبل" },
  { value: "7", label: "۷ روز قبل" },
  { value: "0", label: "خاموش" },
];

export const NotificationsTab = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [defaultReminder, setDefaultReminder] = useState("3");
  const [isSaving, setIsSaving] = useState(false);

  const toggleSetting = (id: string) => {
    setSettings(
      settings.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Save notification settings:", { settings, defaultReminder });
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-white font-semibold mb-4">دریافت نوتیفیکیشن</h3>
        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">
                  {setting.title}
                </p>
                <p className="text-gray-500 text-xs">{setting.description}</p>
              </div>
              <button
                onClick={() => toggleSetting(setting.id)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  setting.enabled ? "bg-indigo-600" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    setting.enabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-white font-semibold mb-4">یادآوری پیش‌فرض</h3>
        <p className="text-gray-400 text-sm mb-3">
          برای اشتراک‌های جدید، چند روز قبل از اتمام یادآوری شود؟
        </p>
        <select
          value={defaultReminder}
          onChange={(e) => setDefaultReminder(e.target.value)}
          className="w-full md:w-48 px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {reminderOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={isSaving}>
          ذخیره تنظیمات
        </Button>
      </div>
    </div>
  );
};
