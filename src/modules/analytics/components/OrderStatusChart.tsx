"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { STATUS_MAP } from "../../shared/constants";

interface Props {
  data: { name: string; value: number }[];
}

const COLORS_HEX: Record<string, string> = {
  pending: "#facc15",
  paid: "#34d399",
  shipped: "#60a5fa",
  delivered: "#818cf8",
  cancelled: "#f87171",
};

const COLORS_BG: Record<string, string> = {
  pending: "bg-yellow-400",
  paid: "bg-emerald-400",
  shipped: "bg-blue-400",
  delivered: "bg-indigo-400",
  cancelled: "bg-red-400",
};

export default function OrderStatusChart({ data }: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-[#0b0c10]/40 border border-zinc-800/40 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col">
      <div className="mb-4">
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1.5">
          Статуси замовлень
        </p>
        <h3 className="text-2xl font-black text-white">Всього {total}</h3>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-full sm:w-1/2 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS_HEX[entry.name] || "#52525b"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#09090b",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 12,
                }}
                formatter={(value, name) => [
                  value as number,
                  STATUS_MAP[String(name)] || String(name),
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full sm:w-1/2 flex flex-col gap-2">
          {data.map((item) => {
            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div key={item.name} className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full shrink-0 ${COLORS_BG[item.name] || "bg-zinc-600"}`}
                />
                <span className="text-zinc-400 text-sm font-medium flex-1">
                  {STATUS_MAP[item.name] || item.name}
                </span>
                <span className="text-white text-sm font-bold">
                  {item.value}
                </span>
                <span className="text-zinc-600 text-xs font-bold w-10 text-right">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
