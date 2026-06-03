"use client";

import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES_STORE,
  PAYMENT_LABELS,
} from "../shared/constants";
import { Order, OrderStatus } from "../shared/types";
import {
  Phone,
  MapPin,
  CreditCard,
  Wallet,
  Calendar,
  Clock,
  ClipboardList,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

type UserOrdersProps = {
  order: Order;
};
const cardVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: delay,
    },
  }),
} as const;

export default function UserOrders({ order }: UserOrdersProps) {
  const status = (order.status ?? "pending") as OrderStatus;

  const steps = [
    { key: "pending", label: "Створено" },
    { key: "paid", label: "Оплачено" },
    { key: "shipped", label: "В дорозі" },
    { key: "delivered", label: "Доставлено" },
  ];

  const currentStepIndex = steps.findIndex((step) => step.key === status);
  const isCancelled = status === "cancelled";

  return (
    <div className="space-y-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={0.1}
        className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-violet-50 text-violet-600 rounded-lg">
                <ClipboardList className="w-4 h-4" />
              </span>
              <h3 className="font-black text-lg text-zinc-900">
                Замовлення #{order._id?.slice(-6).toUpperCase()}
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("uk-UA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleTimeString("uk-UA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </span>
            </div>
          </div>

          <div className="sm:text-right">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border ${ORDER_STATUS_STYLES_STORE[status]}`}
            >
              {ORDER_STATUS_LABELS[status]}
            </span>
          </div>
        </div>
        {!isCancelled ? (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2 sm:gap-3 py-2">
              {steps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isActive = idx === currentStepIndex;

                return (
                  <div key={step.key} className="space-y-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isCompleted
                          ? "bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.15)]"
                          : isActive
                            ? "bg-violet-500 animate-pulse shadow-[0_0_12px_rgba(139,92,246,0.3)] border border-violet-400/20"
                            : "bg-zinc-100"
                      }`}
                    />
                    <p
                      className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-center transition-colors truncate px-0.5 ${
                        isActive
                          ? "text-violet-600"
                          : isCompleted
                            ? "text-zinc-700 font-bold"
                            : "text-zinc-400 font-bold"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold">!</span>
            </div>
            <div>
              <p className="text-sm font-bold">Замовлення було скасовано</p>
              <p className="text-xs text-red-500">
                Якщо у вас виникли запитання, зверніться до нашої служби
                підтримки.
              </p>
            </div>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 space-y-6">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="bg-white border border-zinc-100 rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4"
          >
            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">
              Доставка
            </h4>
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center text-zinc-500 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Телефон
                  </p>
                  <p className="text-sm font-bold text-zinc-800">
                    {order.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center text-zinc-500 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Адреса доставки
                  </p>
                  <p className="text-xs font-bold text-zinc-600 leading-relaxed">
                    {order.address}
                  </p>
                </div>
              </div>

              {order.comment && (
                <div className="p-3 bg-zinc-50/50 border border-zinc-100 rounded-2xl text-xs text-zinc-500 italic">
                  <p className="font-bold text-zinc-400 not-italic uppercase text-[9px] tracking-wider mb-1">
                    Коментар до замовлення
                  </p>
                  {order.comment}
                </div>
              )}
            </div>
          </motion.div>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="bg-white border border-zinc-100 rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4"
          >
            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">
              Оплата
            </h4>
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  order.paymentStatus === "balance"
                    ? "bg-violet-50 border-violet-100 text-violet-500"
                    : "bg-zinc-50 border-zinc-100 text-zinc-500"
                }`}
              >
                {order.paymentStatus === "balance" ? (
                  <Wallet className="w-4 h-4" />
                ) : (
                  <CreditCard className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Спосіб оплати
                </p>
                <p className="text-sm font-bold text-zinc-800">
                  {PAYMENT_LABELS[order.paymentStatus]}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="md:col-span-7"
        >
          <div className="bg-white border border-zinc-100 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 pb-3">
                Товари в замовленні
              </h4>
              <ul className="divide-y divide-zinc-50 space-y-3">
                {order.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-3 pt-3 first:pt-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-zinc-800 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {item.price.toLocaleString("uk-UA")} ₴ × {item.quantity}
                      </p>
                    </div>
                    <span className="font-extrabold text-sm text-zinc-900 shrink-0">
                      {(item.price * item.quantity).toLocaleString("uk-UA")} ₴
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Всього до сплати
                </p>
                <p className="text-xs text-zinc-400">Включаючи ПДВ</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-violet-600">
                  {order.totalAmount.toLocaleString("uk-UA")} ₴
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
