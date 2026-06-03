"use client";

import {
  X,
  ShoppingCart,
  Trash2,
  Image as ImageProduct,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "@/src/modules/shared/store/useCartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartModal() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotal,
    getTotalItems,
  } = useCartStore();

  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRendered(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const t = setTimeout(() => setRendered(false), 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!rendered) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={closeCart}
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 350ms ease",
        }}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
      />

      <div className="absolute inset-y-0 right-0 w-full max-w-md flex pointer-events-none">
        <div
          style={{
            transform: visible ? "translateX(0)" : "translateX(100%)",
            transition: "transform 350ms cubic-bezier(0.32, 0.72, 0, 1)",
          }}
          className="w-full h-full bg-white shadow-2xl flex flex-col pointer-events-auto"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-zinc-900 tracking-tight">
                  Мій кошик
                </h2>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                  {getTotalItems()} товарів
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              type="button"
              aria-label="Закрити кошик"
              className="group p-2.5 bg-zinc-50 hover:bg-zinc-100 rounded-full transition-all active:scale-95 cursor-pointer border border-zinc-200/50"
            >
              <X className="w-4 h-4 text-zinc-500 group-hover:text-zinc-900 transition-colors" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-zinc-50/50">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center border border-zinc-100 mb-6">
                  <ShoppingCart className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-xl font-black text-zinc-800 mb-2">
                  Кошик порожній
                </h3>
                <p className="text-zinc-500 text-sm max-w-62.5 leading-relaxed">
                  Час знайти щось особливе в нашому каталозі товарів.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    router.push("/catalog");
                  }}
                  className="mt-8 px-6 py-3 bg-white border border-zinc-200 hover:border-violet-300 hover:text-violet-600 text-zinc-700 font-bold rounded-full transition-all shadow-sm active:scale-95 cursor-pointer text-sm"
                >
                  Перейти до каталогу
                </button>
              </div>
            ) : (
              <div className="p-4 sm:p-6 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-white p-4 rounded-3xl border border-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex gap-4 transition-all hover:border-violet-100 hover:shadow-[0_8px_30px_rgba(139,92,246,0.06)] group"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                      <ImageProduct className="w-8 h-8 text-zinc-300" />
                    </div>

                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-black text-zinc-800 leading-tight truncate">
                          {item.name}
                        </h3>
                        <button
                          aria-label="Видалити товар з кошика"
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all cursor-pointer opacity-0 group-hover:opacity-100 -mr-1.5 -mt-1.5 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-2">
                        <div className="flex flex-col gap-1">
                          <div
                            className={`flex items-center rounded-full p-1 gap-1 transition-colors ${
                              item.quantity >= item.stock
                                ? "bg-orange-50 border border-orange-200/60"
                                : "bg-zinc-50 border border-zinc-200/60"
                            }`}
                          >
                            <button
                              aria-label="Зменшити кількість товару"
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                )
                              }
                              className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-white active:scale-90 rounded-full transition-all cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span
                              className={`text-xs font-black w-5 text-center select-none ${
                                item.quantity >= item.stock
                                  ? "text-orange-600"
                                  : "text-zinc-800"
                              }`}
                            >
                              {item.quantity}
                            </span>
                            <button
                              aria-label="Збільшити кількість товару"
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                              disabled={item.quantity >= item.stock}
                              className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-white active:scale-90 rounded-full transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          {item.quantity >= item.stock && (
                            <span className="text-[9px] font-black uppercase tracking-wider text-orange-500">
                              Максимум
                            </span>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] font-bold text-zinc-400 mb-0.5">
                            {item.price.toLocaleString()} ₴ / шт
                          </p>
                          <p className="text-base font-black text-zinc-950">
                            {(item.price * item.quantity).toLocaleString()} ₴
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="bg-white border-t border-zinc-100 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
                    Загальна сума
                  </p>
                </div>
                <span className="text-3xl font-black text-zinc-950 tracking-tighter">
                  {getTotal().toLocaleString()} ₴
                </span>
              </div>

              <button
                onClick={() => {
                  closeCart();
                  router.push("/checkout");
                }}
                className="w-full py-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-full font-black text-sm uppercase tracking-widest transition-all duration-200 active:scale-[0.98] shadow-xl shadow-zinc-950/20 cursor-pointer flex items-center justify-center gap-2 group"
              >
                Оформити замовлення
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
