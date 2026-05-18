import { getDashStats } from "@/src/lib/actions/analytics.action";
import DashboardChart from "@/src/components/admin/DashboardChart";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const res = await getDashStats();

  if (!res.success || !res.data) {
    return (
      <div className="p-6 bg-zinc-900/10 border border-white/5 rounded-3xl text-zinc-400 text-sm">
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
    },
    {
      label: "Замовлення",
      value: String(totalOrders),
      icon: ShoppingCart,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
    },
    {
      label: "Клієнти",
      value: String(totalUsers),
      icon: Users,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Середній чек",
      value: `${averageOrderValue.toLocaleString("uk-UA")} ₴`,
      icon: TrendingUp,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
  ];

  const statusStyle: Record<string, string> = {
    pending: "text-amber-400 bg-amber-500/10",
    paid: "text-emerald-400 bg-emerald-500/10",
    shipped: "text-blue-400 bg-blue-500/10",
    delivered: "text-indigo-400 bg-indigo-500/10",
    cancelled: "text-rose-400 bg-rose-500/10",
  };

  return (
    <div className="space-y-4 pb-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-zinc-900/10 border border-white/5 rounded-3xl p-4 sm:p-5 hover:border-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider leading-tight">
                {s.label}
              </span>
              <div
                className={`w-7 h-7 rounded-xl ${s.bg} flex items-center justify-center ${s.color} shrink-0`}
              >
                <s.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="text-xl sm:text-2xl font-black text-white">
              {s.value}
            </span>
          </div>
        ))}
      </div>
      <div className="bg-zinc-900/10 border border-white/5 rounded-3xl p-5">
        <DashboardChart data={revenueTrend} />
      </div>
      <div className="bg-zinc-900/10 border border-white/5 rounded-3xl p-5">
        <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-wider mb-4">
          Останні замовлення
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-125">
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((order) => {
                const statusMap: Record<string, string> = {
                  pending: "Очікується",
                  paid: "Оплачено",
                  shipped: "Відправлено",
                  delivered: "Доставлено",
                  cancelled: "Скасовано",
                };

                return (
                  <tr
                    key={order._id}
                    className="hover:bg-white/20 transition-colors"
                  >
                    <td className="py-3 px-4 text-white text-sm font-semibold">
                      {order.userName}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold ${
                          order.paymentStatus === "balance"
                            ? "text-violet-400 bg-violet-500/10"
                            : "text-zinc-400 bg-zinc-500/10"
                        }`}
                      >
                        {order.paymentStatus === "balance"
                          ? "Баланс"
                          : "Готівка"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold ${
                          statusStyle[order.status] ??
                          "text-zinc-400 bg-zinc-500/10"
                        }`}
                      >
                        {statusMap[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-white text-sm">
                      {order.totalAmount.toLocaleString("uk-UA")} ₴
                    </td>
                  </tr>
                );
              })}
              {recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-10 text-center text-zinc-500 text-sm italic"
                  >
                    Замовлень поки немає
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
