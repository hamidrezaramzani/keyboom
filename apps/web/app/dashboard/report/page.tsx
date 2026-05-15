"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import {
  Wallet,
  TrendingUp,
  CreditCard,
  CalendarClock,
  Activity,
  AlertTriangle,
  PieChart as PieIcon,
  BarChart3,
  Users,
  ChartArea,
} from "lucide-react";

import { DashboardLayout } from "@/app/components/layout";
import { Card, DashboardContentHeader } from "@/app/components";

const report = {
  kpis: {
    totalCost: 8450000,
    monthlyCost: 720000,
    yearlyProjection: 8640000,
    activeSubs: 24,
    upcomingRenewals: 6,
  },

  monthlyTrend: [
    { month: "فروردین", cost: 420000 },
    { month: "اردیبهشت", cost: 510000 },
    { month: "خرداد", cost: 600000 },
    { month: "تیر", cost: 580000 },
    { month: "مرداد", cost: 680000 },
    { month: "شهریور", cost: 720000 },
  ],

  groupCosts: [
    { name: "سرگرمی", value: 3200000 },
    { name: "AI", value: 2100000 },
    { name: "کار", value: 1850000 },
    { name: "ابزارها", value: 1300000 },
  ],

  topSubs: [
    { name: "ChatGPT Plus", cost: 800000 },
    { name: "Netflix", cost: 650000 },
    { name: "Spotify", cost: 420000 },
    { name: "Figma", cost: 380000 },
    { name: "AWS", cost: 900000 },
  ],

  alerts: [
    { type: "danger", text: "۳ اشتراک در ۷ روز آینده تمدید می‌شوند" },
    { type: "warning", text: "هزینه اشتراک‌ها ۱۸٪ افزایش داشته" },
    { type: "info", text: "۲ اشتراک غیر فعال شناسایی شد" },
  ],

  renewalForecast: [
    { day: "امروز", count: 1 },
    { day: "فردا", count: 2 },
    { day: "۳ روز", count: 3 },
    { day: "این هفته", count: 6 },
  ],
};

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <Card variant="default">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{title}</p>
        {Icon && <Icon size={18} className="text-gray-500" />}
      </div>

      <p className="text-xl font-bold mt-3">{value.toLocaleString()}</p>
    </Card>
  );
}

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 vazir rtl">
        <DashboardContentHeader
          Icon={ChartArea}
          title="گزارشات فضای کاری"
          description="تحلیل کلی هزینه ها و رفتار اشتراک ها"
        />

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard
            title="کل هزینه"
            value={report.kpis.totalCost}
            icon={Wallet}
          />

          <StatCard
            title="هزینه ماهانه"
            value={report.kpis.monthlyCost}
            icon={CreditCard}
          />

          <StatCard
            title="پیش‌بینی سالانه"
            value={report.kpis.yearlyProjection}
            icon={TrendingUp}
          />

          <StatCard
            title="اشتراک فعال"
            value={report.kpis.activeSubs}
            icon={Users}
          />

          <StatCard
            title="تمدید نزدیک"
            value={report.kpis.upcomingRenewals}
            icon={CalendarClock}
          />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Trend */}
          <Card variant="default">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 size={18} />
              روند هزینه ماهانه
            </h2>

            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={report.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#6366f1"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Group Pie */}
          <Card variant="default">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieIcon size={18} />
              توزیع هزینه‌ها
            </h2>

            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={report.groupCosts}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                >
                  {report.groupCosts.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* TOP SUBSCRIPTIONS */}
        <Card variant="default">
          <h2 className="text-lg font-semibold mb-4">گران‌ترین اشتراک‌ها</h2>

          <div className="space-y-2">
            {report.topSubs.map((s, i) => (
              <div
                key={i}
                className="flex justify-between border-b border-gray-800 py-2"
              >
                <span className="text-gray-300">{s.name}</span>
                <span className="text-amber-400 font-bold">
                  {s.cost.toLocaleString()} تومان
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* ALERTS + FORECAST */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Alerts */}
          <Card variant="default">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle size={18} />
              هشدارها
            </h2>

            <div className="space-y-3">
              {report.alerts.map((a, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-gray-800/40 border border-gray-800 text-sm"
                >
                  {a.text}
                </div>
              ))}
            </div>
          </Card>

          {/* Forecast */}
          <Card variant="default">
            <h2 className="text-lg font-semibold mb-4">پیش‌بینی تمدیدها</h2>

            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={report.renewalForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
