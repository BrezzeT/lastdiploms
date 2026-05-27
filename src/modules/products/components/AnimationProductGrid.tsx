"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { Product as ProductType } from "@/src/modules/layout/shared/types";
import {
  staggerContainer,
  fadeUpItem,
} from "@/src/modules/layout/shared/animations";

interface AnimatedProductGridProps {
  products: ProductType[];
}

export default function AnimationProductGrid({
  products,
}: AnimatedProductGridProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
    >
      {products.map((product) => (
        <motion.div key={product._id} variants={fadeUpItem}>
          <ProductCard product={product} isAdmin={false} />
        </motion.div>
      ))}
    </motion.div>
  );
}
