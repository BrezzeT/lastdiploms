import { getAnalyticsPageStats } from "@/src/modules/analytics/analytics.actions";
import RevenueAreaChart from "@/src/modules/analytics/components/RevenueAreaChart";
import OrderStatusChart from "@/src/modules/analytics/components/OrderStatusChart";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const res = await getAnalyticsPageStats();

  if (!res.success || !res.data) {
    return (
      <div className="p-6 text-zinc-400">
        Помилка завантаження аналітики: {res.error}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <RevenueAreaChart data={res.data.monthlyTrend} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrderStatusChart data={res.data.orderStatusDate} />
      </div>
    </div>
  );
}
