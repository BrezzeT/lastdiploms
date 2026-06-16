"use server";

import dbConnect from "@/src/modules/shared/db";
import Order from "@/src/modules/orders/order.model";
import User from "@/src/modules/users/user.model";
import Product from "@/src/modules/products/product.model";
import { revalidatePath } from "next/cache";
import { Order as OrderType } from "@/src/modules/shared/types";
import { sendTelegramMessage } from "../shared/telegram/telegram";

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
    const itemsText = items
      .map((item) => `▪️ ${item.name} <b>(x${item.quantity})</b>`)
      .join("\n");

    const message = `🔔 <b>НОВЕ ЗАМОВЛЕННЯ #${newOrder._id.toString().slice(-6)}</b>
#замовлення #нове

💰 <b>Сума:</b> ${totalAmount.toLocaleString("uk-UA")} ₴
💳 <b>Оплата:</b> ${paymentStatus === "balance" ? "Баланс 🟢" : "Готівка 🟡"}
📞 <b>Телефон:</b> <code>${phone}</code>
📍 <b>Адреса:</b> ${address}
📝 <b>Коментар:</b> <i>${comment || "відсутній"}</i>

📦 <b>Товари:</b>
${itemsText}`;

    const tgResult = await sendTelegramMessage(message);
    if (!tgResult.success) {
      console.error("Telegram error:", tgResult.error);
    }
    revalidatePath("/admin/orders");
    revalidatePath("/profile");
    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    revalidatePath("/");

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
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
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
export async function getOrderById(orderId: string) {
  try {
    await dbConnect();
    const order = await Order.findById(orderId).lean();
    if (!order) {
      return { success: false, error: "Замовлення не знайдено" };
    }
    return { success: true, data: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Помилка при отриманні замовлення" };
  }
}
export async function getUserOrders(userId: string) {
  try {
    await dbConnect();
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(orders)),
      total: orders.length,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Помилка при отриманні замовлень користувача",
    };
  }
}
