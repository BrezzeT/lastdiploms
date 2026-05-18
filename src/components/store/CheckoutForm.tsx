"use client";

import { useState } from "react";
import {
  Truck,
  Phone,
  MapPin,
  CreditCard,
  Wallet,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";
import { useAuthStore } from "@/src/store/useAuthStore";
import { createOrder } from "@/src/lib/actions/order.actions";
import { useRouter } from "next/navigation";
import type { Order as OrderType } from "@/src/types";

export default function CheckoutForm() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    comment: "",
    paymentStatus: "cash" as "balance" | "cash",
  });

  const total = getTotal();

  const handleOrder = async () => {
    if (!user) {
      setError("Будь ласка, увійдіть в акаунт");
      return;
    }

    if (items.length === 0) {
      setError("Кошик порожній");
      return;
    }

    if (!formData.address || !formData.phone) {
      setError("Заповніть обов'язкові поля (Адреса та Телефон)");
      return;
    }

    if (formData.paymentStatus === "balance" && (user?.balance || 0) < total) {
      setError("Недостатньо коштів на балансі");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const orderData = {
        userId: user._id,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        address: formData.address,
        phone: formData.phone,
        comment: formData.comment,
        paymentStatus: formData.paymentStatus,
        totalAmount: total,
      };
      const result = await createOrder(orderData as OrderType);
      if (result.success) {
        if (result.newBalance !== undefined) {
          setUser({ ...user, balance: result.newBalance });
        }

        clearCart();
        alert("Замовлення успішно створено!");
        router.push("/");
      } else {
        setError(result.error || "Помилка при створенні замовлення");
      }
    } catch (err) {
      console.error(err);
      setError("Критична помилка сервера");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-zinc-900/10 border border-white/5 p-6 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-violet-500" />
            Доставка та контакти
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider pl-1">
                Телефон
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+380..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider pl-1">
                Адреса
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Місто, відділення..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-violet-500/50 transition-all"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider pl-1">
              Коментар
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              placeholder="Додаткова інформація..."
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-violet-500/50 transition-all min-h-25 resize-none"
            />
          </div>
        </div>
        <div className="bg-zinc-900/10 border border-white/5 p-6 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-violet-500" />
            Спосіб оплати
          </h3>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, paymentStatus: "balance" })
              }
              className={`flex-1 min-w-37.5 p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                formData.paymentStatus === "balance"
                  ? "bg-violet-600 border-violet-500 text-white"
                  : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10"
              }`}
            >
              <Wallet className="w-5 h-5" />
              <div className="text-left">
                <div className="text-sm font-bold uppercase tracking-tight">
                  Баланс
                </div>
                <div className="text-[10px] opacity-60">
                  ₴{user?.balance || 0}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, paymentStatus: "cash" })
              }
              className={`flex-1 min-w-37.5 p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                formData.paymentStatus === "cash"
                  ? "bg-white border-white text-black font-bold"
                  : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10"
              }`}
            >
              <Truck className="w-5 h-5" />
              <div className="text-left">
                <div className="text-sm font-bold uppercase tracking-tight">
                  Готівка
                </div>
                <div className="text-[10px] opacity-60">При отриманні</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900/10 border border-white/5 p-6 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold text-white mb-4">Ваше замовлення</h3>

          <div className="space-y-4 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 group"
              >
                <div className="w-16 h-16 bg-black rounded-2xl border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-zinc-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {item.price} ₴
                    </span>
                    <span className="text-[10px] text-zinc-700">×</span>
                    <span className="text-[10px] font-bold text-violet-400">
                      {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-bold text-white">
                  {item.price * item.quantity} ₴
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/5" />

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-zinc-500 text-sm">Разом до оплати:</span>
              <span className="text-2xl font-black text-white tracking-tighter">
                ₴{total}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleOrder}
            disabled={isSaving || items.length === 0}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 py-4 rounded-xl text-white text-sm font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Підтвердити замовлення"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
