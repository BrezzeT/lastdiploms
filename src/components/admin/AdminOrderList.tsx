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
import { getOrders, updateOrderStatus } from "@/src/lib/actions/order.actions";
import { Order as OrderType } from "@/src/types";
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
        const updatedOrders = orders.map((o) => {
          if (o._id === orderId) {
            return { ...o, status: newStatus } as OrderType;
          }
          return o;
        });
        setOrders(updatedOrders);
      }
    } catch (err) {
      console.error("Помилка оновлення статусу:", err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center animate-pulse">
        <div className="w-12 h-12 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black">
          Синхронізація замовлень...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/10 p-5 rounded-4xl border border-white/5 space-y-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Шукати за номером, телефоном або адресою..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-700"
          />
        </div>

        <div className="flex flex-wrap gap-2">
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
              className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all ${
                activeFilter === f.id
                  ? "bg-white text-black border-white shadow-lg shadow-white/10"
                  : "bg-black/40 border-white/5 text-zinc-500 hover:text-white"
              }`}
            >
              <f.icon
                className={`w-4 h-4 ${activeFilter === f.id ? "text-black" : f.color}`}
              />
              <span className="text-[10px] font-black uppercase tracking-wider">
                {f.label}
              </span>
              <span
                className={`text-[10px] font-black opacity-30 ${activeFilter === f.id ? "text-black" : ""}`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="group bg-zinc-900/10 border border-white/5 rounded-4xl overflow-hidden hover:border-white/10 transition-all"
            >
              <div className="p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-500/10 flex items-center justify-center text-violet-500">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">
                          {order._id?.slice(-6)}
                        </h4>
                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                        <p className="text-[10px] text-zinc-500 font-bold uppercase">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                          <CreditCard className="w-3 h-3 text-zinc-600" />
                          {order.paymentStatus === "balance"
                            ? "Баланс"
                            : "Готівка"}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                          <Package className="w-3 h-3 text-zinc-600" />
                          {order.items.length} Товари
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">
                      Разом
                    </p>
                    <p className="text-2xl font-black text-white tracking-tighter">
                      ₴{order.totalAmount}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-black/40 rounded-2xl border border-white/5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-widest text-[9px] font-black">
                      <User className="w-3 h-3" /> Отримувач
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <Phone className="w-3.5 h-3.5 text-zinc-600" />
                        {order.phone}
                      </div>
                      <div className="flex items-start gap-2 text-zinc-400 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-zinc-600 mt-0.5 shrink-0" />
                        {order.address}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-zinc-500 uppercase tracking-widest text-[9px] font-black">
                      <Package className="w-3 h-3" /> Склад замовлення
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] text-zinc-300 font-bold"
                        >
                          {item.name}{" "}
                          <span className="text-violet-500 ml-1">
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="px-3 py-1.5 bg-violet-600/10 border border-violet-500/10 rounded-lg text-[10px] text-violet-500 font-bold">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4 pt-2">
                  <div className="flex-1 flex items-center w-full overflow-x-auto no-scrollbar gap-1 bg-black/20 p-1 rounded-2xl border border-white/5">
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
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                            isActive
                              ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20 scale-[1.02] z-10"
                              : "text-zinc-600 hover:text-zinc-400 hover:bg-white/5"
                          }`}
                        >
                          <step.icon
                            className={`w-3 h-3 ${isActive ? "text-white" : "opacity-50"}`}
                          />
                          <span className="hidden sm:inline">{step.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shrink-0"
                  >
                    Деталі <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-zinc-900/5 border border-dashed border-white/10 rounded-4xl">
            <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest italic">
              Список замовлень порожній
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
