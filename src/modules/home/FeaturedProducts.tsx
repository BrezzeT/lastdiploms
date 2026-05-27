"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import ProductCard from "@/src/modules/products/components/ProductCard";
import { Product as ProductType } from "@/src/modules/layout/shared/types";
import {
  staggerContainer,
  fadeUpItem,
} from "@/src/modules/layout/shared/animations";

interface FeaturedProductsProps {
  products: ProductType[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  const displayProducts = products.slice(0, 4);

  return (
    <motion.section
      className="space-y-8 mt-16"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-20px", amount: 0.1 }}
      variants={staggerContainer}
    >
      <motion.div
        className="flex items-end justify-between border-b border-zinc-100 pb-5"
        variants={fadeUpItem}
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/10 bg-violet-500/5 text-violet-600 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Гарячі пропозиції
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
            Популярні товари
          </h2>
          <p className="text-zinc-500 text-sm mt-1 max-w-xl">
            Наші найкращі пропозиції, рекомендовані покупцями.
          </p>
        </div>

        <Link
          href="/catalog"
          className="group inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-violet-600 uppercase tracking-widest transition-colors shrink-0"
        >
          Всі
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      <div className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible pb-4 pt-2 snap-x snap-mandatory [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-zinc-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-thumb]:rounded-full">
        {displayProducts.map((product) => (
          <motion.div
            key={product._id}
            variants={fadeUpItem}
            className="snap-start shrink-0 w-64 md:w-auto"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
