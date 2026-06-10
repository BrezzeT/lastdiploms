"use client";

import {
  ChevronLeft,
  Image as ImageIcon,
  Minus,
  Plus,
  ShoppingCart,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Product } from "../../shared/types";
import Link from "next/link";
import { PRODUCT_CATEGORIES, CATEGORY_STYLES } from "../../shared/constants";
import { useCartStore } from "../../shared/store/useCartStore";
import { useState } from "react";
import { motion } from "framer-motion";

interface ProductDetailsProps {
  product: Product;
}

function categoryLabel(id: string) {
  return PRODUCT_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export default function ProductUserDetails({ product }: ProductDetailsProps) {
  const { addItem, openCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      productId: product._id || "",
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0] || "",
      stock: product.stock,
    });
    openCart();
  };

  const catStyle = CATEGORY_STYLES[product.category];
  const CatIcon = catStyle?.icon;
  const isInStock = product.stock > 0;

  return (
    <div className="max-w-6xl mx-auto ">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-8 group text-sm font-medium"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Назад до каталогу
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="aspect-square rounded-4xl bg-linear-to-br from-zinc-50 via-zinc-100 to-zinc-200/60 border border-zinc-200/80 flex items-center justify-center relative overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.04),transparent_60%)]" />
            <ImageIcon className="w-28 h-28 text-zinc-300" strokeWidth={1} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col"
        >
          <div className="mb-1">
            {CatIcon ? (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mb-3 border ${catStyle.borderColor} bg-linear-to-r ${catStyle.lightGradient}`}
              >
                <CatIcon className="w-3.5 h-3.5" />
                {categoryLabel(product.category)}
              </div>
            ) : (
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-3">
                {categoryLabel(product.category)}
              </p>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight leading-tight mb-1">
            {product.name}
          </h1>

          {product.brand && (
            <p className="text-sm text-zinc-400 mt-1.5 mb-5">
              Бренд:{" "}
              <span className="font-bold text-zinc-600">{product.brand}</span>
            </p>
          )}
          {!product.brand && <div className="mb-5" />}

          <div className="flex items-end gap-3 mb-6">
            <p className="text-4xl font-black text-zinc-900 tracking-tight leading-none">
              {product.price.toLocaleString("uk-UA")} ₴
            </p>
            <span
              className={`mb-0.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                isInStock
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-red-500 bg-red-50"
              }`}
            >
              {isInStock
                ? `В наявності · ${product.stock} шт.`
                : "Немає в наявності"}
            </span>
          </div>

          {product.description ? (
            <div className="mb-6 pb-6 border-b border-zinc-100">
              <p className="text-zinc-500 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          ) : (
            <div className="mb-6 pb-6 border-b border-zinc-100">
              <p className="text-zinc-300 text-sm italic">
                Опис для цього товару поки відсутній.
              </p>
            </div>
          )}

          {isInStock && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
              <div className="h-14 flex items-center justify-between sm:justify-start gap-2 bg-zinc-100/80 rounded-2xl px-1.5 border border-zinc-200/40 w-full sm:w-auto shrink-0">
                <button
                  aria-label="Зменшити кількість"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-violet-50 text-zinc-400 hover:text-violet-600 transition-all cursor-pointer shadow-xs border border-zinc-200/40 active:scale-90"
                >
                  <Minus size={16} />
                </button>
                <span className="text-base font-black w-9 text-center text-zinc-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  aria-label="Збільшити кількість"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-violet-50 text-zinc-400 hover:text-violet-600 transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shadow-xs border border-zinc-200/40 active:scale-90"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full sm:flex-1 h-14 rounded-2xl bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm transition-all active:scale-[0.97] flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-violet-600/15 hover:shadow-violet-600/25"
              >
                <ShoppingCart size={18} />
                Додати в кошик ·{" "}
                {(product.price * quantity).toLocaleString("uk-UA")} ₴
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-zinc-400 pt-2">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-violet-400 shrink-0" />
              <span className="text-xs font-semibold">
                Безкоштовна доставка
              </span>
            </div>
            <div className="w-px h-4 bg-zinc-200" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold">Гарантія 12 міс</span>
            </div>
            <div className="w-px h-4 bg-zinc-200" />
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-xs font-semibold">Повернення 14 днів</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
