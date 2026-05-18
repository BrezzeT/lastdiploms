"use server";

import dbConnect from "../db";
import Order from "@/src/models/Order";
import User from "@/src/models/User";
import Product from "@/src/models/Product";
import { revalidatePath } from "next/cache";
import { Order as OrderType } from "@/src/types";

export async function createOrder(formData: OrderType) {
  try {
    await dbConnect();

    const {
      items,
      userId,
      address,
      phone,
      comment,
      paymentStatus,
      totalAmount,
    } = formData;

    let user = null;
    if (paymentStatus === "balance") {
      if (!userId) {
        return {
          success: false,
          error: "Необхідно увійти для оплати балансом!",
        };
      }
      user = await User.findById(userId);
      if (!user) {
        return { success: false, error: "Користувача не знайдено!" };
      }
      if (user.balance < totalAmount) {
        return { success: false, error: "Недостатньо коштів на балансі!" };
      }
      user.balance -= totalAmount;
      await user.save();
    }
    const newOrder = await Order.create({
      userId,
      address,
      phone,
      items,
      paymentStatus,
      totalAmount,
      comment,
      status: paymentStatus === "balance" ? "paid" : "pending",
    });
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    revalidatePath("/admin/orders");
    revalidatePath("/profile");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newOrder)),
      newBalance: paymentStatus === "balance" ? user?.balance : undefined,
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Помилка при створенні замовлення" };
  }
}

export async function getOrders() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return { success: true, data: JSON.parse(JSON.stringify(orders)) };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Помилка при отриманні замовлень" };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await dbConnect();
    await Order.findByIdAndUpdate(orderId, { status });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Помилка при оновленні статусу" };
  }
}
