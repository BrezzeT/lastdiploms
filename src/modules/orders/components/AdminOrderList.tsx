"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  CreditCard,
  User,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";
import {
  getOrders,
  updateOrderStatus,
} from "@/src/modules/orders/order.actions";
import { Order as OrderType } from "@/src/modules/shared/types";
import Link from "next/link";

export default function AdminOrderList() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await getOrders();
      if (res.success) {
        setOrders(res.data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone?.includes(searchQuery) ||
        order.address?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (activeFilter === "all") return true;
      return order.status === activeFilter;
    });
  }, [orders, searchQuery, activeFilter]);

  const stats = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => o.status === "paid").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders(
          orders.map((o) =>
            o._id === orderId ? ({ ...o, status: newStatus } as OrderType) : o,
          ),
        );
      }
    } catch (err) {
      console.error("Помилка оновлення статусу:", err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black">
          Синхронізація замовлень...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#0b0c10]/40 p-4 rounded-3xl border border-zinc-800/40 space-y-4 shadow-xs">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Пошук за номером, телефоном або адресою..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950/40 border border-zinc-800/40 focus:border-violet-500/50 focus:bg-zinc-950/80 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-white outline-none focus:ring-2 focus:ring-violet-500/10 placeholder:text-zinc-600 shadow-inner transition-all"
          />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            {
              id: "all",
              label: "Всі",
              icon: Filter,
              count: stats.all,
              color: "text-zinc-400",
            },
            {
              id: "pending",
              label: "Очікують",
              icon: Clock,
              count: stats.pending,
              color: "text-amber-500",
            },
            {
              id: "paid",
              label: "Оплачені",
              icon: CheckCircle2,
              count: stats.paid,
              color: "text-emerald-500",
            },
            {
              id: "shipped",
              label: "В дорозі",
              icon: Truck,
              count: stats.shipped,
              color: "text-violet-500",
            },
            {
              id: "delivered",
              label: "Доставлені",
              icon: Package,
              count: stats.delivered,
              color: "text-emerald-500",
            },
            {
              id: "cancelled",
              label: "Скасовані",
              icon: XCircle,
              count: stats.cancelled,
              color: "text-red-500",
            },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex flex-col sm:flex-row items-center sm:justify-between gap-1 sm:gap-2 px-3 py-2.5 rounded-2xl border transition-all cursor-pointer ${
                activeFilter === f.id
                  ? "bg-violet-600/15 text-violet-400 border-violet-500/30 shadow-md shadow-violet-500/5"
                  : "bg-zinc-950/40 border-zinc-800/40 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <f.icon
                  className={`w-3.5 h-3.5 shrink-0 ${activeFilter === f.id ? "text-violet-400" : f.color}`}
                />
                <span className="text-[9px] font-bold uppercase tracking-wider leading-tight hidden sm:block">
                  {f.label}
                </span>
              </div>
              <span
                className={`text-[10px] font-black ${activeFilter === f.id ? "text-violet-400/90" : "text-zinc-600"}`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 pb-20">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="group bg-[#0b0c10]/40 border border-zinc-800/40 rounded-3xl overflow-hidden hover:border-violet-500/30 hover:bg-[#0b0c10]/60 transition-all duration-300"
            >
              <div className="p-4 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-violet-600/10 border border-violet-500/10 flex items-center justify-center text-violet-500 shrink-0">
                      <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">
                          #{order._id?.slice(-6)}
                        </h4>
                        <span className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:block" />
                        <p className="text-[10px] text-zinc-500 font-bold uppercase">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "uk-UA",
                              )
                            : "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                          <CreditCard className="w-3 h-3 text-zinc-600" />
                          {order.paymentStatus === "balance"
                            ? "Баланс"
                            : "Готівка"}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                          <Package className="w-3 h-3 text-zinc-600" />
                          {order.items.length} тов.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-0.5">
                      Разом
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-white tracking-tighter">
                      ₴{order.totalAmount.toLocaleString("uk-UA")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-zinc-950/30 rounded-2xl border border-zinc-800/30">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-600 uppercase tracking-widest text-[9px] font-black">
                      <User className="w-3 h-3" /> Отримувач
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <Phone className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        {order.phone}
                      </div>
                      <div className="flex items-start gap-2 text-zinc-400 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-zinc-600 mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{order.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-zinc-600 uppercase tracking-widest text-[9px] font-black">
                      <Package className="w-3 h-3" /> Склад замовлення
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1.5 bg-zinc-900/60 border border-zinc-800/40 rounded-xl text-[10px] text-zinc-300 font-bold"
                        >
                          {item.name}{" "}
                          <span className="text-violet-400 ml-1">
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="px-3 py-1.5 bg-violet-600/10 border border-violet-500/20 rounded-xl text-[10px] text-violet-400 font-bold">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 flex items-center overflow-x-auto no-scrollbar gap-1 bg-zinc-950/30 p-1 rounded-2xl border border-zinc-800/30">
                    {[
                      { id: "pending", label: "Очікує", icon: Clock },
                      { id: "paid", label: "Оплачено", icon: CheckCircle2 },
                      { id: "shipped", label: "Відправлено", icon: Truck },
                      { id: "delivered", label: "Виконано", icon: Package },
                      { id: "cancelled", label: "Скасовано", icon: XCircle },
                    ].map((step) => {
                      const isActive = order.status === step.id;
                      return (
                        <button
                          key={step.id}
                          onClick={() =>
                            handleStatusChange(order._id || "", step.id)
                          }
                          className={`flex-1 flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                            isActive
                              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20 scale-[1.02] z-10"
                              : "text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/40"
                          }`}
                        >
                          <step.icon
                            className={`w-3 h-3 shrink-0 ${isActive ? "text-white" : "opacity-50"}`}
                          />
                          <span className="hidden sm:inline">{step.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-violet-600/20 active:scale-95 transition-all shrink-0"
                  >
                    Деталі <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-zinc-900/5 border border-dashed border-zinc-800/40 rounded-3xl">
            <p className="text-zinc-500 text-sm italic">
              Список замовлень порожній
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
