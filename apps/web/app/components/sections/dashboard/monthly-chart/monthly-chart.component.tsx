"use client";

import { Card } from "@/app/components";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

interface ChartData {
  month: string;
  cost: number;
}

interface MonthlyChartProps {
  data: ChartData[];
}

const formatCurrency = (value: number) => {
  return value.toLocaleString("fa-IR") + " تومان";
};

export const MonthlyChart = ({ data }: MonthlyChartProps) => {
  return (
    <Card>
      <h3 className="text-white font-semibold mb-4">نمودار هزینه ماهانه</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={formatCurrency} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [formatCurrency(value), "هزینه"]}
            />
            <Line dataKey="cost" fill="#6366F1" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
