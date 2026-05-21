import { getDashStats } from "@/src/modules/analytics/analytics.actions";
import DashboardChart from "@/src/modules/analytics/components/DashboardChart";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const res = await getDashStats();

  if (!res.success || !res.data) {
    return (
      <div className="p-6 bg-[#0b0c10]/40 border border-zinc-800/40 rounded-3xl text-zinc-400 text-sm">
        Помилка: {res.error}
      </div>
    );
  }

  const {
    totalRevenue,
    totalOrders,
    totalUsers,
    averageOrderValue,
    recentOrders,
    revenueTrend,
  } = res.data;

  const stats = [
    {
      label: "Загальний дохід",
      value: `${totalRevenue.toLocaleString("uk-UA")} ₴`,
      icon: DollarSign,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/10",
    },
    {
      label: "Замовлення",
      value: String(totalOrders),
      icon: ShoppingCart,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/10",
    },
    {
      label: "Клієнти",
      value: String(totalUsers),
      icon: Users,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/10",
    },
    {
      label: "Середній чек",
      value: `${averageOrderValue.toLocaleString("uk-UA")} ₴`,
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/10",
    },
  ];

  const statusStyle: Record<string, string> = {
    pending: "text-amber-400 bg-amber-500/10 border-amber-500/15",
    paid: "text-emerald-400 bg-emerald-500/10 border-emerald-500/15",
    shipped: "text-blue-400 bg-blue-500/10 border-blue-500/15",
    delivered: "text-indigo-400 bg-indigo-500/10 border-indigo-500/15",
    cancelled: "text-rose-400 bg-rose-500/10 border-rose-500/15",
  };

  const statusMap: Record<string, string> = {
    pending: "Очікується",
    paid: "Оплачено",
    shipped: "Відправлено",
    delivered: "Доставлено",
    cancelled: "Скасовано",
  };

  return (
    <div className="space-y-4 pb-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-[#0b0c10]/40 border border-zinc-800/40 rounded-3xl p-4 sm:p-5 hover:border-violet-500/20 hover:bg-[#0b0c10]/60 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider leading-tight">
                {s.label}
              </span>
              <div
                className={`w-8 h-8 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center ${s.color} shrink-0`}
              >
                <s.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {s.value}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-[#0b0c10]/40 border border-zinc-800/40 rounded-3xl p-4 sm:p-5">
        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-4">
          Динаміка доходів
        </p>
        <DashboardChart data={revenueTrend} />
      </div>

      <div className="bg-[#0b0c10]/40 border border-zinc-800/40 rounded-3xl p-4 sm:p-5">
        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-4">
          Останні замовлення
        </p>

        {recentOrders.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-zinc-600 text-xs italic">Замовлень поки немає</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <div className="min-w-[480px] px-1">
              <div className="flex flex-col gap-2">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center gap-3 sm:gap-4 px-4 py-3 rounded-2xl hover:bg-zinc-900/40 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate group-hover:text-violet-300 transition-colors">
                        {order.userName}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-full border shrink-0 ${
                        order.paymentStatus === "balance"
                          ? "text-violet-400 bg-violet-500/10 border-violet-500/15"
                          : "text-zinc-400 bg-zinc-500/10 border-zinc-500/15"
                      }`}
                    >
                      {order.paymentStatus === "balance" ? "Баланс" : "Готівка"}
                    </span>

                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-full border shrink-0 ${
                        statusStyle[order.status] ?? "text-zinc-400 bg-zinc-500/10 border-zinc-500/15"
                      }`}
                    >
                      {statusMap[order.status] ?? order.status}
                    </span>

                    <p className="font-black text-white text-sm shrink-0">
                      {order.totalAmount.toLocaleString("uk-UA")} ₴
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
