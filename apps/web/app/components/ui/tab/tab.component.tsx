"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback, ReactNode } from "react";

const TAB_QUERY_KEY = "tab";

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
}

export const Tabs = ({ tabs, defaultTab }: TabsProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const activeTab =
    searchParams.get(TAB_QUERY_KEY) || defaultTab || tabs[0]?.id;

  const handleTabChange = useCallback(
    (tabId: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(TAB_QUERY_KEY, tabId);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="w-full">
      <div className="border-b border-gray-800">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
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

      <div className="mt-6 md:w-3/4 w-full">
        {activeTabContent || (
          <div className="text-center text-gray-400 py-8">محتوایی یافت نشد</div>
        )}
      </div>
    </div>
  );
};
