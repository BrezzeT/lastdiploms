"use server";

import dbConnect from "../db";
import Order from "@/src/models/Order";
import User from "@/src/models/User";

export interface SalesDay {
  date: string;
  revenue: number;
  ordersCount: number;
}

export async function getDashStats() {
  try {
    await dbConnect();

    const totalUsers = await User.countDocuments({ role: "user" });
    const validOrders = await Order.find({ status: { $ne: "cancelled" } });
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
