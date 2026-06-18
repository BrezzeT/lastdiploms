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

function getRangeStart(days: number) {
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  return start;
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
  });
}

function buildEmptyTrend(days: number): SalesDay[] {
  const now = new Date();
  return Array.from({ length: days }, (_, i) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (days - 1 - i));
    day.setHours(0, 0, 0, 0);
    return { date: formatDayLabel(day), revenue: 0, ordersCount: 0 };
  });
}

function mergeTrend(
  days: number,
  aggregated: {
    _id: string;
    revenue: number;
    ordersCount: number;
    products?: string[];
  }[],
): SalesDay[] {
  const map = new Map(aggregated.map((row) => [row._id, row]));
  return buildEmptyTrend(days).map((day) => {
    const found = map.get(day.date);
    if (!found) return day;
    return {
      date: day.date,
      revenue: found.revenue,
      ordersCount: found.ordersCount,
      ...(found.products ? { products: found.products } : {}),
    };
  });
}

export async function getDashStats() {
  try {
    await dbConnect();

    const [totalUsers, totalOrders, statsAgg, recentOrders, revenueAgg] =
      await Promise.all([
        User.countDocuments({ role: "user" }),
        Order.countDocuments({}),
        Order.aggregate([
          { $match: { status: { $ne: "cancelled" } } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalAmount" },
              validOrdersCount: { $sum: 1 },
            },
          },
        ]),
        Order.aggregate([
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: "users",
              let: { userId: "$userId" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [{ $toString: "$_id" }, "$$userId"],
                    },
                  },
                },
                { $project: { name: 1 } },
              ],
              as: "user",
            },
          },
          {
            $project: {
              _id: { $toString: "$_id" },
              totalAmount: 1,
              status: 1,
              paymentStatus: 1,
              userName: {
                $ifNull: [{ $arrayElemAt: ["$user.name", 0] }, "Гість"],
              },
            },
          },
        ]),
        Order.aggregate([
          {
            $match: {
              status: { $ne: "cancelled" },
              createdAt: { $gte: getRangeStart(7) },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%d.%m",
                  date: "$createdAt",
                  timezone: "Europe/Kyiv",
                },
              },
              revenue: { $sum: "$totalAmount" },
              ordersCount: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

    const stats = statsAgg[0];
    const totalRevenue = stats?.totalRevenue ?? 0;
    const validOrdersCount = stats?.validOrdersCount ?? 0;
    const averageOrderValue =
      validOrdersCount > 0 ? Math.round(totalRevenue / validOrdersCount) : 0;

    return {
      success: true as const,
      data: {
        totalRevenue,
        totalOrders,
        totalUsers,
        averageOrderValue,
        recentOrders,
        revenueTrend: mergeTrend(7, revenueAgg),
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
    const startDate = getRangeStart(30);

    const [monthlyAgg, productsAgg, orderStatusDate] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            status: { $ne: "cancelled" },
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%d.%m",
                date: "$createdAt",
                timezone: "Europe/Kyiv",
              },
            },
            revenue: { $sum: "$totalAmount" },
            ordersCount: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        {
          $match: {
            status: { $ne: "cancelled" },
            createdAt: { $gte: startDate },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: {
              day: {
                $dateToString: {
                  format: "%d.%m",
                  date: "$createdAt",
                  timezone: "Europe/Kyiv",
                },
              },
              name: "$items.name",
            },
          },
        },
        {
          $group: {
            _id: "$_id.day",
            products: { $addToSet: "$_id.name" },
          },
        },
        {
          $project: {
            products: { $slice: ["$products", 5] },
          },
        },
      ]),
      Order.aggregate([
        { $group: { _id: "$status", value: { $sum: 1 } } },
        { $sort: { value: -1 } },
        { $project: { name: "$_id", value: 1, _id: 0 } },
      ]),
    ]);

    const productsMap = new Map(
      productsAgg.map((row) => [row._id as string, row.products as string[]]),
    );

    const monthlyTrend = mergeTrend(30, monthlyAgg).map((day) => ({
      ...day,
      products: productsMap.get(day.date),
    }));

    return {
      success: true as const,
      data: { monthlyTrend, orderStatusDate },
    };
  } catch (error) {
    console.error("Помилка аналітики:", error);
    return { success: false as const, error: "Помилка завантаження" };
  }
}
