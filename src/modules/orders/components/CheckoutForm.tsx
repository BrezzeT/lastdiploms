"use client";

import { useState, useEffect } from "react";
import {
  Truck,
  Phone,
  MapPin,
  CreditCard,
  Wallet,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useCartStore } from "@/src/modules/layout/shared/store/useCartStore";
import { useAuthStore } from "@/src/modules/users/store/useAuthStore";
import { createOrder } from "@/src/modules/orders/order.actions";
import { getUserBalance } from "@/src/modules/users/user.actions";
import { useRouter } from "next/navigation";
import type { Order as OrderType } from "@/src/modules/layout/shared/types";
import AuthModal from "@/src/modules/users/components/AuthModal";
import { toast } from "sonner";

export default function CheckoutForm() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [isAuthModal, setIsAuthModal] = useState(false);
  useEffect(() => {
    const userId = user?._id;
    if (!userId) return;

    const fetchBalance = async () => {
      try {
        const res = await getUserBalance(userId);
        if (res.success && res.data) {
          if (user.balance !== res.data.balance) {
            setUser({ ...user, balance: res.data.balance });
          }
        }
      } catch (err) {
        console.error("Помилка оновлення балансу:", err);
      }
    };

    fetchBalance();
  }, [user, setUser]);

  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    comment: "",
    paymentStatus: "cash" as "balance" | "cash",
  });

  const total = getTotal();

  const handleOrder = async () => {
    if (formData.paymentStatus === "balance" && !user) {
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
        userId: user?._id,
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
        if (result.newBalance !== undefined && user) {
          setUser({ ...user, balance: result.newBalance });
        }

        clearCart();
        router.push("/");
        toast.success("Замовлення успішно створено!", {
          description: "Деталі замовлення будуть відправлені в телеграм",
        });
      } else {
        setError(result.error || "Помилка при створенні замовлення");
      }
    } catch (error) {
      console.error("Помилка при створенні замовлення:", error);
      toast.error("Сталася помилка при створенні замовлення");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white border border-zinc-200 p-6 sm:p-8 rounded-4xl md:rounded-[40px] space-y-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
          <div className="space-y-6">
            <h3 className="text-lg font-extrabold text-zinc-900 flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </span>
              Доставка та контакти
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 pl-1">
                  Телефон
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+380..."
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-violet-500 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400/80 shadow-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 pl-1">
                  Адреса
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Місто, відділення..."
                    className="w-full bg-zinc-50 border border-zinc-200 focus:border-violet-500 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400/80 shadow-xs"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 pl-1">
                Коментар
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                placeholder="Додаткова інформація..."
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-violet-500 focus:bg-white rounded-2xl py-3.5 px-4 text-sm text-zinc-900 outline-none transition-all min-h-28 resize-none placeholder:text-zinc-400/80 shadow-xs"
              />
            </div>
          </div>

          <div className="h-px bg-zinc-100/80" />

          <div className="space-y-6">
            <h3 className="text-lg font-extrabold text-zinc-900 flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </span>
              Спосіб оплати
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user ? (
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, paymentStatus: "balance" })
                  }
                  className={`p-5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                    formData.paymentStatus === "balance"
                      ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/15"
                      : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100/50 hover:border-zinc-300"
                  }`}
                >
                  <Wallet className="w-5 h-5 shrink-0" />
                  <div className="text-left">
                    <div>
                      <div className="text-sm font-bold tracking-tight">
                        Баланс
                      </div>
                      <div className="text-[10px] opacity-60 mt-0.5">
                        ₴{user?.balance || 0}
                      </div>
                    </div>
                  </div>
                </button>
              ) : (
                <div className="p-5 rounded-2xl border transition-all flex items-center justify-center gap-3 bg-zinc-50 border-zinc-200 text-zinc-400 hover:bg-zinc-100/50 hover:border-zinc-300 relative">
                  <div className="absolute w-32 h-32 opacity-0 blur-4xl" />
                  <button
                    onClick={() => setIsAuthModal(true)}
                    type="button"
                    className="text-xs font-bold text-zinc-500 hover:text-zinc-800 cursor-pointer text-center leading-normal"
                  >
                    Увійдіть, щоб скористатися балансом
                  </button>
                  {isAuthModal && (
                    <AuthModal
                      isOpen={isAuthModal}
                      onClose={() => setIsAuthModal(false)}
                    />
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, paymentStatus: "cash" })
                }
                className={`p-5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                  formData.paymentStatus === "cash"
                    ? "bg-zinc-900 border-zinc-900 text-white font-bold shadow-lg shadow-zinc-900/10"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100/50 hover:border-zinc-300"
                }`}
              >
                <Truck className="w-5 h-5 shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-bold tracking-tight">
                    Готівка
                  </div>
                  <div className="text-[10px] opacity-60 mt-0.5">
                    При отриманні
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-zinc-200 p-6 sm:p-8 rounded-4xl md:rounded-[40px] space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <h3 className="text-lg font-extrabold text-zinc-900 mb-4">
            Ваше замовлення
          </h3>

          <div className="space-y-4 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 group"
              >
                <div className="w-16 h-16 bg-zinc-50 rounded-2xl border border-zinc-200/60 overflow-hidden shrink-0 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-zinc-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-zinc-800 truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {item.price.toLocaleString()} ₴
                    </span>
                    <span className="text-[10px] text-zinc-300">×</span>
                    <span className="text-[10px] font-bold text-violet-600">
                      {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-bold text-zinc-900">
                  {(item.price * item.quantity).toLocaleString()} ₴
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-zinc-100" />

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-zinc-500 text-sm font-medium">
                Разом до оплати:
              </span>
              <span className="text-2xl font-extrabold text-zinc-950">
                {total.toLocaleString()} ₴
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
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 py-3.5 rounded-full text-white text-base font-bold transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Підтвердити"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
