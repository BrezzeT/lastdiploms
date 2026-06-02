"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import CatalogFilters from "./CatalogFilters";
import { Product as ProductType } from "@/src/modules/layout/shared/types";
import {
  staggerContainer,
  fadeUpItem,
} from "@/src/modules/layout/shared/animations";
import { Sparkles } from "lucide-react";

interface AnimatedProductGridProps {
  products: ProductType[];
}

export default function AnimationProductGrid({
  products,
}: AnimatedProductGridProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") return products;
    return products.filter((product) => product.category === activeFilter);
  }, [activeFilter, products]);

  return (
    <>
      <motion.div
        className="border-b border-zinc-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-200 bg-violet-50 text-violet-600 text-xs font-bold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Оберіть найкраще
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-zinc-950 tracking-tight">
            Каталог товарів
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base mt-2 max-w-xl font-normal leading-relaxed">
            Знайдіть найкращі пропозиції для вашого бізнесу та дому. Лише
            сертифіковані та якісні товари з гарантією.
          </p>
        </div>
        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest bg-zinc-100 rounded-full px-4 py-2 shrink-0 self-start md:self-auto shadow-xs border border-zinc-200">
          Знайдено {filteredProducts.length} товарів
        </div>
      </motion.div>

      <CatalogFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: 20 }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div key={product._id} variants={fadeUpItem}>
                <ProductCard product={product} isAdmin={false} />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-zinc-400 text-base font-medium">
                Товарів у цій категорії поки немає
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
