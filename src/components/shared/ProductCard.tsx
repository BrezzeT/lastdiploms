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
    <div className="group bg-white border border-zinc-200/50 rounded-3xl overflow-hidden hover:border-zinc-300/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-500">
      <div className="aspect-square bg-linear-to-b from-zinc-50 to-zinc-100/50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <ImageProduct
          size={48}
          className="text-zinc-300 group-hover:text-violet-500 group-hover:scale-110 transition-all duration-500 shrink-0"
        />
      </div>
      <div className="p-5 space-y-4">
        <div>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1.5">
            {product.category}
          </p>
          <h3 className="text-zinc-800 font-bold text-sm truncate group-hover:text-zinc-950 transition-colors">
            {product.name}
          </h3>
        </div>
        <div className="flex items-center justify-between gap-4 pt-1">
          <p className="text-lg font-extrabold text-zinc-900 tracking-tight shrink-0">
            {product.price.toLocaleString()} ₴
          </p>
          <div className="flex items-center justify-between gap-2">
            <div className="h-9 flex items-center gap-1.5 bg-zinc-100 rounded-full px-1 border border-zinc-200/10">
              <button
                aria-label="Зменшити кількість"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={product.stock <= 0}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-zinc-200/60 disabled:bg-transparent text-zinc-500 hover:text-zinc-800 transition-all disabled:opacity-20 shadow-xs border border-zinc-200/20 disabled:border-none"
              >
                <Minus size={12} />
              </button>
              <span
                className={`text-xs font-bold w-5 text-center ${product.stock <= 0 ? "text-zinc-400" : "text-zinc-800"}`}
              >
                {product.stock <= 0 ? 0 : quantity}
              </span>
              <button
                aria-label="Збільшити кількість"
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={quantity >= product.stock || product.stock <= 0}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-zinc-200/60 disabled:bg-transparent text-zinc-500 hover:text-zinc-800 transition-all disabled:opacity-20 shadow-xs border border-zinc-200/20 disabled:border-none"
              >
                <Plus size={12} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-9 h-9 rounded-full bg-violet-600 text-white hover:bg-violet-500 transition-all active:scale-90 flex items-center justify-center shrink-0 disabled:bg-zinc-100 disabled:text-zinc-300 disabled:shadow-none disabled:cursor-not-allowed shadow-md shadow-violet-600/10 hover:shadow-lg hover:shadow-violet-600/20"
              aria-label={
                product.stock <= 0 ? "Немає в наявності" : "Додати в кошик"
              }
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
