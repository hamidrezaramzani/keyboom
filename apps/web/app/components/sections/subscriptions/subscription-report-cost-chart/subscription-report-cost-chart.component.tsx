"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from "recharts";
import { BarChart3, Info, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/app/components";
import { MonthlyCostData, PeriodDetail } from "@/app/services/subscription";

interface CostChartProps {
  data: MonthlyCostData[];
  currentPrice: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const hasPeriod = data.periods && data.periods.length > 0;

    return (
      <div
        className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl"
        style={{ direction: "rtl" }}
      >
        <p className="text-gray-300 font-semibold mb-2">
          {label} / {data.year}
        </p>
        <p className="text-indigo-400 text-lg font-bold mb-2">
          {payload[0].value.toLocaleString("fa-IR")} تومان
        </p>

        {hasPeriod && (
          <div className="border-t border-gray-700 pt-2 mt-1">
            <p className="text-yellow-400 text-sm flex items-center gap-1 mb-2">
              <Info size={14} />
              بازه‌های ویژه این ماه:
            </p>
            {data.periods.map((period: PeriodDetail, idx: number) => (
              <div key={idx} className="text-xs text-gray-400 space-y-1 mr-2">
                <p>📌 {period.title}</p>
                <p>
                  💰 قیمت ماهانه: {period.monthlyPrice.toLocaleString("fa-IR")}{" "}
                  تومان
                </p>
                <p>
                  📅 روزهای {period?.dateRange?.start} تا{" "}
                  {period?.dateRange?.end} ({period.daysInMonth} روز)
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
}

function PeriodDetailsList({
  data,
  currentPrice,
}: {
  data: MonthlyCostData[];
  currentPrice: number;
}) {
  const periodMonths = data.filter((item) => item.periods.length > 0);

  if (periodMonths.length === 0) return null;

  return (
    <div className="mt-4 p-3 bg-gray-800/30 rounded-lg">
      <p className="text-yellow-400 text-sm flex items-center gap-2 mb-2">
        <Info size={14} />
        بازه‌های قیمتی ویژه:
      </p>
      <div className="space-y-2">
        {periodMonths.map((item, idx) => (
          <div key={idx} className="text-sm text-gray-400">
            <p className="font-semibold text-gray-300">{item.monthName} ماه:</p>
            {item.periods.map((period, pIdx) => {
              const priceDiff = period.monthlyPrice - currentPrice;
              const isHigher = priceDiff > 0;
              const percentChange = (
                (Math.abs(priceDiff) / currentPrice) *
                100
              ).toFixed(1);

              return (
                <div
                  key={pIdx}
                  className="mr-4 text-xs space-y-1 border-r-2 border-gray-700 pr-3"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-300">
                      • {period.title}
                    </span>
                    <span className="text-gray-500">
                      (روزهای {period.dateRange?.start} تا{" "}
                      {period.dateRange?.end})
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gray-400">
                      قیمت ویژه:
                      <span className="font-bold text-gray-200 mr-1">
                        {period.monthlyPrice.toLocaleString("fa-IR")}
                      </span>
                      تومان
                    </span>

                    <div className="flex items-center gap-1">
                      {isHigher ? (
                        <>
                          <TrendingUp size={12} className="text-red-400" />
                          <span className="text-red-400">{percentChange}%</span>
                          <span className="text-red-400/70 text-[11px]">
                            ({priceDiff.toLocaleString("fa-IR")} تومان بیشتر)
                          </span>
                        </>
                      ) : priceDiff < 0 ? (
                        <>
                          <TrendingDown size={12} className="text-green-400" />
                          <span className="text-green-400">
                            {percentChange}%
                          </span>
                          <span className="text-green-400/70 text-[11px]">
                            ({Math.abs(priceDiff).toLocaleString("fa-IR")} تومان
                            کمتر)
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500 text-[11px]">
                          برابر با قیمت پایه
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SubscriptionReportCostChart({ data, currentPrice }: CostChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    hasPeriod: item.periods.length > 0,
  }));

  const periodMonths = chartData
    .filter((item) => item.hasPeriod)
    .map((item) => item.monthName);

  return (
    <Card variant="default">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart3 size={18} />
        روند هزینه ماهانه
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="monthName"
            stroke="#9ca3af"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <YAxis
            stroke="#9ca3af"
            tickFormatter={(value) => value.toLocaleString("fa-IR")}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ direction: "rtl" }}
            content={({ payload }) => {
              if (!payload) return null;
              return (
                <div
                  className="flex justify-center gap-4 mt-2"
                  style={{ direction: "rtl" }}
                >
                  {payload.map((entry, index) => (
                    <div
                      key={`item-${index}`}
                      className="flex items-center gap-2"
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "2px",
                          backgroundColor: entry.color,
                          ...(entry.value === "شروع بازه ویژه" && {
                            backgroundImage:
                              "repeating-linear-gradient(90deg, #f59e0b, #f59e0b 5px, transparent 5px, transparent 10px)",
                          }),
                        }}
                      />
                      <span style={{ color: entry.color }}>{entry.value}</span>
                    </div>
                  ))}
                </div>
              );
            }}
          />

          {periodMonths.map((month: string, idx: number) => (
            <ReferenceLine
              key={idx}
              x={month}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: "🎯",
                position: "top",
                fill: "#f59e0b",
                fontSize: 14,
              }}
            />
          ))}

          <Line
            type="monotone"
            dataKey="cost"
            name="هزینه ماهانه"
            stroke="#6366f1"
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={payload.hasPeriod ? 6 : 4}
                  fill={payload.hasPeriod ? "#f59e0b" : "#6366f1"}
                  stroke="#fff"
                  strokeWidth={2}
                />
              );
            }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <PeriodDetailsList data={data} currentPrice={currentPrice} />
    </Card>
  );
}
