"use client";

import { useGetDashboardQuery } from "@/app/services/dashboard/api-dashboard.endpoint";
import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Users,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  LucideLayoutDashboard,
} from "lucide-react";
import {
  Card,
  DashboardContentHeader,
  DashboardLayout,
  SubscriptionCalendar,
  SubscriptionReportStatsCard,
} from "@/app/components";
import { formatPriceIRR } from "../lib/helpers";
import {
  Cell,
  Pie,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
} from "recharts";

export default function DashboardPage() {
  const [range, setRange] = useState<"3" | "6" | "12">("6");

  const {
    data: dashboard,
    isLoading,
    error,
  } = useGetDashboardQuery({
    params: {
      range,
    },
  });

  if (!dashboard) return null;

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا در دریافت اطلاعات</div>;

  const COLORS = [
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
  ];

  return (
    <DashboardLayout>
      <DashboardContentHeader
        Icon={LucideLayoutDashboard}
        title="داشبورد"
        description="خلاصه وضعیت مالی و اشتراک‌های شما"
      />
      <div className="space-y-6 vazir rtl mt-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SubscriptionReportStatsCard
            title="مجموع هزینه"
            value={formatPriceIRR(dashboard.stats.totalCost)}
            icon={Wallet}
            titleBadge="تا به امروز"
          />
          <SubscriptionReportStatsCard
            title="میانگین ماهانه"
            value={dashboard.stats.averageMonthly}
            icon={TrendingUp}
          />
          <SubscriptionReportStatsCard
            title="اشتراک‌های فعال"
            value={dashboard.stats.activeSubscriptions}
            icon={Users}
          />
          <SubscriptionReportStatsCard
            title="هزینه ماه جاری"
            value={formatPriceIRR(dashboard.stats.currentMonthCost)}
            icon={CreditCard}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 size={18} />
                روند هزینه ماهانه
              </h2>
              <div className="flex gap-2">
                {["3", "6", "12"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r as "3" | "6" | "12")}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      range === r
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {r} ماه
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={450}>
              <LineChart data={dashboard.costPerMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  textAnchor="start"
                  height={60}
                  interval={0}
                />
                <YAxis
                  stroke="#9ca3af"
                  tickFormatter={(value) => value.toLocaleString("fa-IR")}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${value.toLocaleString("fa-IR")} تومان`,
                    "هزینه",
                  ]}
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #4b5563",
                    borderRadius: "8px",
                    padding: "8px 12px",
                  }}
                  labelStyle={{ color: "#d1d5db", fontSize: "12px" }}
                  itemStyle={{
                    color: "#818cf8",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                  cursor={{ stroke: "#4b5563", strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#818cf8" }}
                  name="هزینه ماهانه"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieIcon size={18} />
              هزینه بر اساس دسته‌بندی
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={dashboard.costPerCategories}
                  dataKey="cost"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  label={({ categoryName, percentage }) => {
                    return `${categoryName} ${percentage}%`;
                  }}
                  outerRadius={150}
                  innerRadius={50}
                  paddingAngle={5}
                >
                  {dashboard.costPerCategories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#1f2937"
                      strokeWidth={2}
                      width="500px"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `${value.toLocaleString("fa-IR")} تومان`
                  }
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #4b5563",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              {dashboard.costPerCategories.map((category, index) => (
                <div
                  key={category.categoryId}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-300">
                    {category.categoryName}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({category.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity size={18} />
              آخرین فعالیت‌ها
            </h2>
            <div className="space-y-2">
              {dashboard?.lastActivities?.map((activity) => (
                <div
                  key={activity.id}
                  className="border-b border-gray-800 py-2"
                >
                  <p className="text-sm">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4">گران‌ترین اشتراک‌ها</h2>
            <div className="space-y-2">
              {dashboard.topSubscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex justify-between items-center border-b border-gray-800 py-2"
                >
                  <span>{sub.name}</span>
                  <span className="text-amber-400">
                    {sub.price.toLocaleString()} تومان
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1">
          <SubscriptionCalendar items={dashboard.subscriptionCalendar} />
        </div>
      </div>
    </DashboardLayout>
  );
}
