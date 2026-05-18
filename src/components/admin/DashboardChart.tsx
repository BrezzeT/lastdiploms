"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { SalesDay } from "@/src/lib/actions/analytics.action";

interface Props {
  data: SalesDay[];
}

export default function DashboardChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 15, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#71717a", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#71717a", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : `${v}₴`)}
        />
        <Tooltip
          contentStyle={{
            background: "#09090b",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            color: "#fff",
            fontSize: 12,
          }}
          formatter={(value) => [
            `${Number(value).toLocaleString("uk-UA")} ₴`,
            "Дохід",
          ]}
          cursor={{ fill: "rgba(139,92,246,0.06)" }}
        />
        <Bar dataKey="revenue" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.4} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}
