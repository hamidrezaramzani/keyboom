"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  CreditCard,
  CalendarClock,
  TrendingUp,
  DollarSign,
  RefreshCw,
  Activity,
  BarChart3,
  Clock,
  Pencil,
  XCircle,
  PlusCircle,
} from "lucide-react";

import { DashboardLayout } from "@/app/components/layout";
import { Card } from "@/app/components";

const subscription = {
  name: "Spotify Premium",
  status: "فعال",
  group: "سرگرمی",
  countdown: 12,

  totalSpent: 2384000,
  currentPrice: 149000,
  renewalCount: 16,
  remainingDays: 12,

  priceHistory: [
    { date: "1403/01", price: 89000 },
    { date: "1404/05", price: 119000 },
    { date: "1405/01", price: 149000 },
  ],

  costOverTime: [
    { month: "فروردین", cost: 89000 },
    { month: "اردیبهشت", cost: 90000 },
    { month: "خرداد", cost: 95000 },
    { month: "تیر", cost: 110000 },
    { month: "مرداد", cost: 120000 },
    { month: "شهریور", cost: 149000 },
  ],

  insights: {
    priceIncrease: 67,
    projectedYearly: 1788000,
    avgMonthly: 124000,
  },

  renewals: [
    { date: "1405/01/28", amount: 149000 },
    { date: "1404/12/28", amount: 149000 },
    { date: "1404/11/28", amount: 119000 },
  ],
};

function StatCard({ title, value, icon: Icon, color = "text-white" }: any) {
  return (
    <Card variant="default">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{title}</p>
        {Icon && <Icon size={18} className="text-gray-500" />}
      </div>

      <p className={`text-xl font-bold mt-3 ${color}`}>{value}</p>
    </Card>
  );
}

export default function SubscriptionPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 vazir rtl">
        {/* HEADER */}
        <div className="rounded-2xl border border-gray-800 p-6 bg-gray-900/50  rounded-2xl p-6 border border-gray-800">
          <div className="flex items-start justify-between">
            {/* LEFT */}
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Activity className="text-primary-400" size={22} />
                {subscription.name}
              </h1>

              <p className="text-gray-400 mt-2">
                وضعیت: {subscription.status} • گروه: {subscription.group}
              </p>

              <p className="text-gray-500 text-sm mt-3 flex items-center gap-2">
                <Clock size={14} />
                {subscription.countdown} روز تا تمدید بعدی
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">
              <button className="btn-primary btn-md flex items-center gap-2">
                <RefreshCw size={16} />
                تمدید
              </button>

              <button className="btn-secondary btn-md flex items-center gap-2">
                <Pencil size={16} />
                ویرایش
              </button>

              <button className="btn-outline btn-md flex items-center gap-2">
                <PlusCircle size={16} />
                بازه قیمتی
              </button>

              <button className="btn-danger btn-md flex items-center gap-2">
                <XCircle size={16} />
                لغو
              </button>
            </div>
          </div>
        </div>

        {/* HERO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="مجموع هزینه"
            value={`${subscription.totalSpent.toLocaleString()} تومان`}
            icon={DollarSign}
            color="text-emerald-400"
          />

          <StatCard
            title="قیمت فعلی"
            value={`${subscription.currentPrice.toLocaleString()} تومان`}
            icon={CreditCard}
          />

          <StatCard
            title="تعداد تمدید"
            value={subscription.renewalCount}
            icon={RefreshCw}
          />

          <StatCard
            title="روزهای باقی‌مانده"
            value={`${subscription.remainingDays} روز`}
            icon={CalendarClock}
            color="text-amber-400"
          />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card variant="default">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 size={18} />
              روند هزینه
            </h2>

            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={subscription.costOverTime}>
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

          <Card variant="default">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={18} />
              تاریخچه قیمت
            </h2>

            <div className="space-y-3">
              {subscription.priceHistory.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b border-gray-800 py-2"
                >
                  <span className="text-gray-400">{p.date}</span>
                  <span className="font-bold">
                    {p.price.toLocaleString()} تومان
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* INSIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="default">
            <p className="text-gray-400 flex items-center gap-2">
              <TrendingUp size={14} />
              افزایش قیمت
            </p>

            <p className="text-xl font-bold mt-3 text-amber-400">
              +{subscription.insights.priceIncrease}٪
            </p>
          </Card>

          <Card variant="default">
            <p className="text-gray-400 flex items-center gap-2">
              <DollarSign size={14} />
              پیش‌بینی سالانه
            </p>

            <p className="text-xl font-bold mt-3">
              {subscription.insights.projectedYearly.toLocaleString()} تومان
            </p>
          </Card>

          <Card variant="default">
            <p className="text-gray-400 flex items-center gap-2">
              <Activity size={14} />
              میانگین ماهانه
            </p>

            <p className="text-xl font-bold mt-3">
              {subscription.insights.avgMonthly.toLocaleString()} تومان
            </p>
          </Card>
        </div>

        {/* BOTTOM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card variant="default">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <RefreshCw size={18} />
              تمدیدها
            </h2>

            <div className="space-y-2">
              {subscription.renewals.map((r, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b border-gray-800 py-2"
                >
                  <span className="text-gray-400 flex items-center gap-2">
                    <Clock size={14} />
                    {r.date}
                  </span>

                  <span>{r.amount.toLocaleString()} تومان</span>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="default">
            <h2 className="text-lg font-semibold mb-4">جمع‌بندی</h2>

            <div className="space-y-3 text-sm text-gray-300 leading-7">
              <p>• این اشتراک فعال است</p>
              <p>• افزایش قیمت ۶۷٪ نسبت به شروع</p>
              <p>• میانگین هزینه ماهانه ۱۲۴٬۰۰۰ تومان</p>
              <p>• تمدید بعدی در {subscription.countdown} روز</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
