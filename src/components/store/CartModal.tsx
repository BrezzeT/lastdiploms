"use client";

import { X, ShoppingCart, Trash2, Image as ImageProduct } from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";
import { useRouter } from "next/navigation";

export default function CartModal() {
  const router = useRouter();
  const { items, isOpen, closeCart, removeItem, getTotal, getTotalItems } =
    useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closeCart}
      />

      <div className="w-full max-w-2xl bg-white border border-zinc-200/80 rounded-[40px] overflow-hidden relative shadow-2xl animate-in fade-in zoom-in-95 duration-300 flex flex-col">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-violet-500/30 to-transparent" />

        <div className="flex items-center justify-between px-6 sm:px-10 py-6 border-b border-zinc-100 bg-zinc-50/50">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Кошик</h2>
            <p className="text-zinc-500 text-xs mt-0.5 font-medium">
              {getTotalItems()} товарів
            </p>
          </div>
          <button
            aria-label="Закрити"
            onClick={closeCart}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-center px-6">
              <ShoppingCart className="w-12 h-12 text-zinc-300 mb-4" />
              <p className="text-zinc-800 font-bold text-lg">Кошик порожній</p>
            </div>
          ) : (
            <div className="px-6 sm:px-10 py-2 max-h-[50vh] overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-6 py-6 border-b border-zinc-100 last:border-0"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-50 rounded-2xl shrink-0 border border-zinc-200/60 flex items-center justify-center">
                    <ImageProduct className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-300" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-zinc-800 truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-zinc-500 text-xs font-bold">
                        {item.price.toLocaleString()} ₴
                      </span>
                      <span className="text-zinc-300 text-[10px]">×</span>
                      <span className="text-violet-600 text-xs font-bold">
                        {item.quantity}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      aria-label="Видалити товар"
                      onClick={() => removeItem(item.productId)}
                      className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-lg sm:text-xl font-bold text-zinc-950">
                      {(item.price * item.quantity).toLocaleString()} ₴
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 sm:px-10 py-8 border-t border-zinc-100 bg-zinc-50/50">
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-semibold text-zinc-500">
                Всього
              </span>
              <span className="text-2xl font-bold text-zinc-950">
                {getTotal().toLocaleString()} ₴
              </span>
            </div>

            <div className="flex justify-center">
              <button
                className="px-10 py-4 bg-violet-600 text-white rounded-3xl font-bold text-sm hover:bg-violet-500 transition-all active:scale-95 shadow-lg shadow-violet-600/10"
                onClick={() => {
                  closeCart();
                  router.push("/checkout");
                }}
              >
                Оформити замовлення
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
