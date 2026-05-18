"use client";
import { Product as ProductType } from "@/src/types";
import {
  Edit2,
  Trash2,
  ShoppingCart,
  Image as ImageProduct,
  Minus,
  Plus,
} from "lucide-react";
import { useCartStore } from "@/src/store/useCartStore";
import { useState } from "react";

interface ProductCardProps {
  product: ProductType;
  isAdmin?: boolean;
}

export default function ProductCard({ product, isAdmin }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      productId: product._id || "",
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0] || "",
    });
    openCart();
  };
  if (isAdmin) {
    return (
      <div className="flex items-center gap-4 bg-zinc-900/10 border border-white/5 p-5 rounded-2xl hover:border-violet-500/30 transition-colors group">
        <div className="w-12 h-12 rounded-xl bg-zinc-900/30 flex items-center justify-center shrink-0">
          <ImageProduct size={20} className="text-zinc-700" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm truncate">
            {product.name}
          </h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            {product.category}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-8 px-4">
          <div className="text-right min-w-20">
            <p className="text-[10px] text-zinc-500 font-bold uppercase mb-0.5">
              Ціна
            </p>
            <p className="text-sm font-bold text-white">
              {product.price.toLocaleString()} ₴
            </p>
          </div>
          <div className="text-right min-w-15">
            <p className="text-[10px] text-zinc-500 font-bold uppercase mb-0.5">
              Склад
            </p>
            <p
              className={`text-sm font-bold ${product.stock > 5 ? "text-emerald-500" : "text-red-500"}`}
            >
              {product.stock} шт
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-4 border-l border-white/5">
          <button
            className="p-2.5 rounded-xl bg-white/5 text-zinc-400 hover:text-white transition-colors"
            aria-label="Редагувати товар"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            aria-label="Видалити товар"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-zinc-900/20 border border-white/5 rounded-3xl overflow-hidden hover:border-white/30 transition-colors">
      <div className="aspect-square bg-zinc-900/40 flex items-center justify-center">
        <ImageProduct size={48} className="text-zinc-800" />
      </div>
      <div className="p-4 space-y-3">
        <div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">
            {product.category}
          </p>
          <h3 className="text-white font-bold text-sm truncate">
            {product.name}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg font-black text-white">
            {product.price.toLocaleString()} ₴
          </p>
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="h-10 flex items-center gap-1 bg-white/5 rounded-xl px-1 border border-white/5">
              <button
                aria-label="Зменшити кількість"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={product.stock <= 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all disabled:opacity-20"
              >
                <Minus size={14} />
              </button>
              <span
                className={`text-xs font-bold w-5 text-center ${product.stock <= 0 ? "text-zinc-700" : "text-white"}`}
              >
                {product.stock <= 0 ? 0 : quantity}
              </span>
              <button
                aria-label="Збільшити кількість"
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={quantity >= product.stock || product.stock <= 0}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all disabled:opacity-20"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-10 h-10 rounded-xl bg-white/40 text-white hover:bg-white/50 transition-all active:scale-95 flex items-center justify-center shrink-0 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:shadow-none disabled:cursor-not-allowed"
              aria-label={
                product.stock <= 0 ? "Немає в наявності" : "Додати в кошик"
              }
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
