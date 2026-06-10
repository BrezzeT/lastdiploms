"use server";

import dbConnect from "@/src/modules/shared/db";
import Order from "@/src/modules/orders/order.model";
import User from "@/src/modules/users/user.model";

export interface SalesDay {
  date: string;
  revenue: number;
  ordersCount: number;
  products?: string[];
}

export async function getDashStats() {
  try {
    await dbConnect();

    const totalUsers = await User.countDocuments({ role: "user" });
    const validOrders = await Order.find({
      status: { $ne: "cancelled" },
    }).lean();
    const totalOrders = await Order.countDocuments({});
    const totalRevenue = validOrders.reduce(
      (sum, o) => sum + (o.totalAmount as number),
      0,
    );
    const averageOrderValue =
      validOrders.length > 0
        ? Math.round(totalRevenue / validOrders.length)
        : 0;

    const latestOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    const recentOrders = await Promise.all(
      latestOrders.map(async (order) => {
        const user = await User.findById(order.userId).lean();
        return {
          _id: (order._id as { toString(): string }).toString(),
          totalAmount: order.totalAmount as number,
          status: order.status as string,
          paymentStatus: order.paymentStatus as string,
          userName: (user as { name?: string } | null)?.name ?? "Гість",
        };
      }),
    );

    const now = new Date();
    const revenueTrend: SalesDay[] = Array.from({ length: 7 }, (_, i) => {
      const dayStart = new Date(now);
      dayStart.setDate(now.getDate() - (6 - i));
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const dayOrders = validOrders.filter((o) => {
        const d = new Date(o.createdAt as Date);
        return d >= dayStart && d < dayEnd;
      });

      return {
        date: dayStart.toLocaleDateString("uk-UA", {
          day: "2-digit",
          month: "2-digit",
        }),
        revenue: dayOrders.reduce((s, o) => s + (o.totalAmount as number), 0),
        ordersCount: dayOrders.length,
      };
    });

    return {
      success: true as const,
      data: {
        totalRevenue,
        totalOrders,
        totalUsers,
        averageOrderValue,
        recentOrders,
        revenueTrend,
      },
    };
  } catch (error) {
    console.error("Помилка аналітики:", error);
    return {
      success: false as const,
      error: "Не вдалося завантажити аналітику",
    };
  }
}
export async function getAnalyticsPageStats() {
  try {
    await dbConnect();
    const validOrders = await Order.find({
      status: { $ne: "cancelled" },
    }).lean();
    const now = new Date();
    const monthlyTrend: SalesDay[] = Array.from({ length: 30 }, (_, i) => {
      const dayStart = new Date(now);
      dayStart.setDate(now.getDate() - (29 - i));
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);
      const dayOrders = validOrders.filter((o) => {
        const d = new Date(o.createdAt as Date);
        return d >= dayStart && d < dayEnd;
      });
      const productNames = dayOrders
        .flatMap((o) =>
          (o.items as { name: string }[]).map((item) => item.name),
        )
        .filter((name, idx, arr) => arr.indexOf(name) === idx)
        .slice(0, 5);

      return {
        date: dayStart.toLocaleDateString("uk-UA", {
          day: "2-digit",
          month: "2-digit",
        }),
        revenue: dayOrders.reduce((s, o) => s + (o.totalAmount as number), 0),
        ordersCount: dayOrders.length,
        products: productNames,
      };
    });
    const allOrder = await Order.find({}).lean();
    const statusCounts = allOrder.reduce(
      (acc, order) => {
        const status = order.status as string;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const orderStatusDate = Object.entries(statusCounts).map(
      ([name, value]) => ({
        name,
        value,
      }),
    );
    return {
      success: true as const,
      data: { monthlyTrend, orderStatusDate },
    };
  } catch (error) {
    console.error("Помилка аналітики:", error);
    return { success: false as const, error: "Помилка завантаження" };
  }
}
