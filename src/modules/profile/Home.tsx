"use client";

import { useState } from "react";
import { useAuthStore } from "../users/store/useAuthStore";
import { User2, ArrowLeft } from "lucide-react";
import ProfileOrders from "./ProfileOrders";
import ProfileSettings from "./ProfileSettings";
import { PROFILE_MENU_ITEMS } from "../layout/shared/constants";
import { Order as OrderType } from "../layout/shared/types";
import { motion } from "framer-motion";

export default function ProfileHome() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  const currentItem = PROFILE_MENU_ITEMS.find(
    (item) => item.href === activeTab,
  );

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-zinc-500 font-bold">Будь ласка, увійдіть в акаунт</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <motion.aside
          className="w-full md:w-80 shrink-0 top-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col gap-5">
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
              Покупець
            </p>

            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center overflow-hidden border border-zinc-150">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User2 className="w-8 h-8" />
                )}
              </div>
              <div className="text-center">
                <p className="font-black text-zinc-900">{user.name}</p>
                <p className="text-xs text-zinc-400">{user.email}</p>
              </div>
            </div>

            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 text-center">
              <p className="text-xs text-zinc-400 mb-1">Ваш баланс</p>
              <p className="text-2xl font-black text-zinc-900">
                {user.balance.toLocaleString()} ₴
              </p>
            </div>
          </div>
        </motion.aside>
        <main className="flex-1 w-full min-w-0">
          <div className="flex items-center justify-between h-5 mb-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">
              {activeTab === null
                ? "Меню профілю"
                : selectedOrder
                  ? `Замовлення #${selectedOrder._id?.slice(-6)}`
                  : currentItem?.label}
            </h2>

            {activeTab !== null && (
              <button
                onClick={() => {
                  if (selectedOrder) {
                    setSelectedOrder(null);
                  } else {
                    setActiveTab(null);
                  }
                }}
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-violet-600 transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                Назад
              </button>
            )}
          </div>
          {activeTab === null ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {PROFILE_MENU_ITEMS.map((item) => (
                <motion.button
                  key={item.href}
                  onClick={() => {
                    setActiveTab(item.href);
                    setSelectedOrder(null);
                  }}
                  className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col items-center gap-4 hover:border-violet-200 hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)] transition-all active:scale-[0.98] cursor-pointer group w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, ease: "linear" }}
                >
                  <div className="w-16 h-16 bg-violet-50 text-violet-500 group-hover:bg-violet-100 rounded-2xl flex items-center justify-center transition-colors">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-zinc-700 group-hover:text-violet-600 transition-colors text-center">
                    {item.label}
                  </p>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="w-full">
              {activeTab === "/profile/orders" && (
                <ProfileOrders
                  selectedOrder={selectedOrder}
                  setSelectedOrder={setSelectedOrder}
                />
              )}
              {activeTab === "/profile/settings" && <ProfileSettings />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
