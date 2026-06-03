"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../users/store/useAuthStore";
import { getUserOrders } from "../orders/order.actions";
import { Order as OrderType, OrderStatus } from "../shared/types";
import { ShoppingBag } from "lucide-react";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES_STORE,
} from "../layout/shared/constants";
import UserOrders from "./UserOrders";
import { motion, Variants } from "framer-motion";

const PAGE_SIZE = 5;

type ProfileOrdersProps = {
  selectedOrder: OrderType | null;
  setSelectedOrder: (order: OrderType | null) => void;
};

const orderItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (index: number) => ({
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "linear",
      delay: index * 0.05,
    },
  }),
};

export default function ProfileOrders({
  selectedOrder,
  setSelectedOrder,
}: ProfileOrdersProps) {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const visibleOrders = showAll ? orders : orders.slice(0, PAGE_SIZE);
  const hasMore = orders.length > PAGE_SIZE;

  useEffect(() => {
    if (!user?._id) return;

    const fetchOrders = async () => {
      const res = await getUserOrders(user._id!);
      if (res.success) {
        setOrders(res.data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user?._id]);

  if (loading) {
    return (
      <div className="py-10 text-center">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          Завантаження...
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-10 text-center bg-white border border-dashed border-zinc-200 rounded-2xl">
        <ShoppingBag className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
        <p className="text-sm font-bold text-zinc-500">Замовлень поки немає</p>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="w-full">
        <UserOrders order={selectedOrder} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {visibleOrders.map((order, index) => {
        const status = (order.status ?? "pending") as OrderStatus;

        return (
          <motion.button
            key={order._id}
            type="button"
            variants={orderItemVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            onClick={() => setSelectedOrder(order)}
            className="bg-white border border-zinc-100 rounded-2xl p-3 sm:p-4 block w-full text-left cursor-pointer hover:border-zinc-200 transition-colors hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${ORDER_STATUS_STYLES_STORE[status]}`}
              >
                {ORDER_STATUS_LABELS[status]}
              </span>
              <p className="text-sm font-black text-zinc-900 shrink-0">
                {order.totalAmount.toLocaleString("uk-UA")} ₴
              </p>
            </div>

            <ul className="space-y-2">
              {order.items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span className="font-bold text-zinc-700 truncate">
                    {item.name}
                    <span className="text-zinc-400 font-normal ml-1">
                      ×{item.quantity}
                    </span>
                  </span>
                  <span className="font-bold text-zinc-900 shrink-0">
                    {(item.price * item.quantity).toLocaleString("uk-UA")} ₴
                  </span>
                </li>
              ))}
            </ul>
          </motion.button>
        );
      })}

      {hasMore && (
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: visibleOrders.length * 0.05 }}
          onClick={() => setShowAll((prev) => !prev)}
          className="py-2.5 text-xs font-bold uppercase tracking-widest text-violet-600 hover:text-violet-500 border border-violet-200 rounded-2xl bg-violet-50/50 hover:bg-violet-50 transition-colors cursor-pointer text-center"
        >
          {showAll ? "Згорнути" : `Показати ще (${orders.length - PAGE_SIZE})`}
        </motion.button>
      )}
    </div>
  );
}
