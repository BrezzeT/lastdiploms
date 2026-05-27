"use client";

import Link from "next/link";
import { ArrowRight, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.section
      className="relative overflow-hidden py-16 md:py-24 flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-linear-to-tr from-violet-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="relative z-10 flex flex-col items-center max-w-4xl">
        <motion.div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/10 bg-violet-500/5 text-violet-600 text-xs sm:text-[13px] font-bold mb-6 sm:mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          Нова колекція 2026
        </motion.div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight mb-6 text-zinc-950">
          Знайди все,{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-600 to-indigo-600">
            що потрібно
          </span>
        </h1>

        <p className="text-zinc-500 text-base sm:text-lg md:text-xl max-w-2xl mb-8 sm:mb-10 font-normal leading-relaxed">
          Тисячі перевірених товарів за найкращими цінами. Швидка доставка,
          гарантія якості та підтримка на кожному етапі замовлення.
        </p>

        <div className="flex flex-row items-center gap-3 w-full justify-center sm:gap-4">
          <Link
            href="/catalog"
            className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-8 sm:py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-full text-xs sm:text-base transition-all shadow-lg shadow-violet-600/15 active:scale-95 cursor-pointer w-36 sm:w-52 text-center"
          >
            В каталог
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/catalog"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-8 sm:py-3.5 border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50/50 font-bold rounded-full text-xs sm:text-base transition-all active:scale-95 bg-white cursor-pointer w-36 sm:w-52 text-center"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-500" />
            Акції
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
