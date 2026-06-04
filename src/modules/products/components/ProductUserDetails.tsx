"use client";

import { ChevronLeft, Image as ImageIcon, Construction } from "lucide-react";
import { Product } from "../../shared/types";
import Link from "next/link";
import { PRODUCT_CATEGORIES } from "../../shared/constants";

interface ProductDetailsProps {
  product: Product;
}

function categoryLabel(id: string) {
  return PRODUCT_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export default function ProductUserDetails({ product }: ProductDetailsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Назад до каталогу
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square max-h-[420px] lg:max-h-none rounded-3xl bg-linear-to-b from-zinc-100 to-zinc-200/50 border border-zinc-200/80 flex items-center justify-center">
          <ImageIcon className="w-24 h-24 text-zinc-300" strokeWidth={1.25} />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-2">
              {categoryLabel(product.category)}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              {product.name}
            </h1>
            {product.brand && (
              <p className="text-sm text-zinc-500 mt-2">
                Бренд:{" "}
                <span className="font-semibold text-zinc-700">
                  {product.brand}
                </span>
              </p>
            )}
          </div>

          <p className="text-3xl font-black text-zinc-900 tracking-tight">
            {product.price.toLocaleString("uk-UA")} ₴
          </p>

          <p
            className={`text-sm font-bold ${
              product.stock > 0 ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {product.stock > 0
              ? `В наявності: ${product.stock} шт.`
              : "Немає в наявності"}
          </p>

          <div
            className="rounded-2xl border-2 border-dashed border-amber-300/80 bg-amber-50/90 px-6 py-8 flex flex-col items-center text-center gap-3"
            role="status"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200/80 flex items-center justify-center">
              <Construction className="w-7 h-7 text-amber-600" />
            </div>
            <p className="text-base font-black text-amber-900 tracking-tight">
              Розділ у розробці
            </p>
            <p className="text-sm text-amber-800/90 max-w-sm leading-relaxed">
              Детальна сторінка товару (опис, характеристики, галерея фото та
              кнопка «Додати в кошик») поки в розробці. Скористайтеся каталогом
              або кошиком на головній сторінці магазину.
            </p>
          </div>

          <Link
            href="/catalog"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-colors w-full sm:w-auto"
          >
            Повернутися до каталогу
          </Link>
        </div>
      </div>
    </div>
  );
}
