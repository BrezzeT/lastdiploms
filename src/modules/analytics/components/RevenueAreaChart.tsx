"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { SalesDay } from "@/src/modules/analytics/analytics.actions";
import { TrendingUp } from "lucide-react";

interface Props {
  data: SalesDay[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { payload: SalesDay }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const day = payload[0].payload;

  return (
    <div className="bg-[#09090b] border border-zinc-800 rounded-2xl p-4 shadow-xl min-w-48">
      <p className="text-zinc-400 text-xs font-bold mb-2">{label}</p>
      <p className="text-white text-lg font-black">
        {day.revenue.toLocaleString("uk-UA")} ₴
      </p>
      <p className="text-zinc-500 text-xs mt-0.5">
        {day.ordersCount} {day.ordersCount === 1 ? "замовлення" : "замовлень"}
      </p>
      {day.products && day.products.length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-800">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
            Товари
          </p>
          {day.products.map((name, i) => (
            <p key={i} className="text-zinc-300 text-xs truncate max-w-48">
              • {name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RevenueAreaChart({ data }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalMonthRevenue = data.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = data.reduce((sum, day) => sum + day.ordersCount, 0);

  return (
    <div className="bg-[#0b0c10]/40 border border-zinc-800/40 rounded-3xl p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-3">
        <div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1.5">
            Динаміка за 30 днів
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            {totalMonthRevenue.toLocaleString("uk-UA")} ₴
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 bg-zinc-900/50 px-3 py-2 rounded-xl border border-zinc-800/40">
          <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
          {totalOrders} замовлень
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
        <div className="min-w-150 h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
