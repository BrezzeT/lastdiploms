"use client";

import {
  X,
  ShoppingCart,
  Trash2,
  Image as ImageProduct,
  Plus,
  Minus,
} from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";
import { useRouter } from "next/navigation";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
      <div
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
        onClick={closeCart}
      />

      <div className="w-full max-w-lg md:max-w-xl bg-white border border-zinc-100 rounded-4xl md:rounded-[40px] overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-violet-500/30 to-transparent" />

        <div className="flex items-center justify-between px-6 sm:px-10 py-6 border-b border-zinc-100 bg-zinc-50/50">
          <div>
            <h2 className="text-xl font-extrabold text-zinc-900">Кошик</h2>
            <p className="text-zinc-500 text-xs mt-0.5 font-bold">
              {getTotalItems()} товарів
            </p>
          </div>
          <button
            aria-label="Закрити"
            onClick={closeCart}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-200/50 mb-4">
                <ShoppingCart className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="text-zinc-800 font-extrabold text-lg">
                Кошик порожній
              </p>
              <p className="text-zinc-400 text-sm mt-1">
                Додайте товари з каталогу, щоб почати шопінг.
              </p>
            </div>
          ) : (
            <div className="px-6 sm:px-10 py-2 max-h-[40vh] md:max-h-[50vh] overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 sm:gap-6 py-6 border-b border-zinc-100 last:border-0"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-50 rounded-2xl shrink-0 border border-zinc-200/60 flex items-center justify-center">
                    <ImageProduct className="w-7 h-7 sm:w-9 sm:h-9 text-zinc-300" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-800 truncate">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center bg-zinc-100 border border-zinc-200/40 rounded-full p-1 gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-white active:scale-90 rounded-full transition-all cursor-pointer"
                          aria-label="Зменшити кількість"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-zinc-800 w-6 text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-white active:scale-90 rounded-full transition-all cursor-pointer"
                          aria-label="Збільшити кількість"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-zinc-400 text-xs font-medium">
                        × {item.price.toLocaleString()} ₴
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between self-stretch shrink-0 py-1">
                    <button
                      aria-label="Видалити товар"
                      onClick={() => removeItem(item.productId)}
                      className="text-zinc-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="text-base sm:text-lg font-black text-zinc-950">
                      {(item.price * item.quantity).toLocaleString()} ₴
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 sm:px-10 py-8 border-t border-zinc-100 bg-zinc-50/50 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <span className="text-base sm:text-lg font-bold text-zinc-500">
                Всього до сплати
              </span>
              <span className="text-xl sm:text-2xl font-black text-zinc-950">
                {getTotal().toLocaleString()} ₴
              </span>
            </div>

            <div className="flex justify-end">
              <button
                className="w-full sm:w-auto px-10 py-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-bold text-base transition-all duration-200 active:scale-98 shadow-md shadow-violet-600/10 hover:shadow-violet-600/20 cursor-pointer text-center"
                onClick={() => {
                  closeCart();
                  router.push("/checkout");
                }}
              >
                Оформити
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
