"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PRODUCT_CATEGORIES,
  CATEGORY_STYLES,
} from "../layout/shared/constants";

type Props = {
  counts: Record<string, number>;
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

export default function HomeCategories({ counts }: Props) {
  return (
    <motion.section
      className="space-y-6 mt-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.div
        className="flex items-end justify-between"
        variants={itemVariants}
      >
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-violet-500 mb-1">
            Огляд
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
            Категорії товарів
          </h2>
        </div>
        <Link
          href="/catalog"
          className="text-xs font-bold text-zinc-400 hover:text-violet-600 uppercase tracking-widest transition-colors hidden sm:block"
        >
          Всі товари →
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {PRODUCT_CATEGORIES.map((cat) => {
          const style = CATEGORY_STYLES[cat.id];
          const count = counts[cat.id] ?? 0;
          if (!style) return null;
          const Icon = style.icon;
          return (
            <motion.div key={cat.id} variants={itemVariants}>
              <Link
                href={`/catalog?category=${cat.id}`}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border ${style.borderColor} bg-linear-to-br ${style.lightGradient} p-6 h-44 sm:h-52 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block`}
              >
                <div
                  className={`absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-linear-to-br ${style.gradient} opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500`}
                />
                <div
                  className={`absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-linear-to-br ${style.gradient} opacity-15 group-hover:opacity-25 group-hover:scale-125 transition-all duration-500`}
                />
                <div
                  className={`w-12 h-12 rounded-2xl ${style.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-black text-zinc-900">
                    {cat.label}
                  </p>
                  <p className="text-xs font-bold text-zinc-400 mt-0.5">
                    {count}{" "}
                    {count === 1 ? "товар" : count < 5 ? "товари" : "товарів"}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
