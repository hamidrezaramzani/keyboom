"use client";

import { Card } from "@/app/components";
import { Activity } from "lucide-react";

export function SubscriptionReportSkeletonLoading() {
  return (
    <div className="p-6 space-y-6 vazir rtl">
      <div className="rounded-2xl border border-gray-800 p-6 bg-gray-900/50 animate-pulse">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Activity size={22} className="text-gray-700" />
              <div className="h-7 w-48 bg-gray-700 rounded-lg"></div>
            </div>
            <div className="flex gap-5 flex-wrap mt-2">
              <div className="h-6 w-24 bg-gray-700 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
              <div className="h-6 w-32 bg-gray-700 rounded-full"></div>
              <div className="h-6 w-32 bg-gray-700 rounded-full"></div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="h-3 w-3 bg-gray-700 rounded-full"></div>
              <div className="h-4 w-36 bg-gray-700 rounded"></div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="h-10 w-24 bg-gray-700 rounded-lg"></div>
            <div className="h-10 w-24 bg-gray-700 rounded-lg"></div>
            <div className="h-10 w-24 bg-gray-700 rounded-lg"></div>
            <div className="h-10 w-24 bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} variant="default">
            <div className="flex items-center justify-between animate-pulse">
              <div className="h-4 w-24 bg-gray-700 rounded"></div>
              <div className="h-4 w-4 bg-gray-700 rounded"></div>
            </div>
            <div className="h-7 w-32 bg-gray-700 rounded mt-3 animate-pulse"></div>
          </Card>
        ))}
      </div>

      <Card variant="default">
        <div className="flex items-center gap-2 mb-4 animate-pulse">
          <div className="h-5 w-5 bg-gray-700 rounded"></div>
          <div className="h-6 w-32 bg-gray-700 rounded"></div>
        </div>

        <div className="w-full h-[300px] bg-gray-800/30 rounded-lg animate-pulse">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-600">در حال بارگذاری نمودار...</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-800/30 rounded-lg animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-4 bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-700 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-16 bg-gray-700/30 rounded"></div>
            <div className="h-16 bg-gray-700/30 rounded"></div>
          </div>
        </div>
      </Card>
    </div>
  );
}
