"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import ProductCard from "../shared/ProductCard";
import { Product as ProductType } from "@/src/types";

export default function AdminProductList({
  initialProducts,
}: {
  initialProducts: ProductType[];
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (activeFilter === "all") return true;
      if (activeFilter === "in-stock") return product.stock > 5;
      if (activeFilter === "low-stock")
        return product.stock <= 5 && product.stock > 0;
      if (activeFilter === "out-of-stock") return product.stock === 0;
      return true;
    });
  }, [initialProducts, searchQuery, activeFilter]);

  const stats = {
    all: initialProducts.length,
    inStock: initialProducts.filter((p) => p.stock > 5).length,
    lowStock: initialProducts.filter((p) => p.stock <= 5 && p.stock > 0).length,
    outOfStock: initialProducts.filter((p) => p.stock === 0).length,
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/10 p-4 rounded-3xl border border-white/5 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Швидкий пошук товарів..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-700"
            />
          </div>

          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-6 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-500 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Додати товар</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            {
              id: "all",
              label: "Всі товари",
              icon: Filter,
              count: stats.all,
              color: "text-zinc-400",
            },
            {
              id: "in-stock",
              label: "В наявності",
              icon: CheckCircle2,
              count: stats.inStock,
              color: "text-emerald-500",
            },
            {
              id: "low-stock",
              label: "Закінчуються",
              icon: AlertTriangle,
              count: stats.lowStock,
              color: "text-amber-500",
            },
            {
              id: "out-of-stock",
              label: "Немає",
              icon: XCircle,
              count: stats.outOfStock,
              color: "text-red-500",
            },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${
                activeFilter === f.id
                  ? "bg-white text-black border-white"
                  : "bg-black/40 border-white/5 text-zinc-500 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <f.icon
                  className={`w-4 h-4 ${activeFilter === f.id ? "text-black" : f.color}`}
                />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {f.label}
                </span>
              </div>
              <span
                className={`text-[10px] font-black ${activeFilter === f.id ? "opacity-50" : "opacity-20"}`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-20">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} isAdmin />
          ))
        ) : (
          <div className="py-20 text-center bg-zinc-900/5 border border-dashed border-white/5 rounded-3xl">
            <p className="text-zinc-500 text-sm italic">Нічого не знайдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
