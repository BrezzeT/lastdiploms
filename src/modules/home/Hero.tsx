"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
export default function Hero() {
  return (
    <motion.section
      className="relative overflow-hidden"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/10 bg-violet-500/5 text-violet-600 text-[13px] font-semibold mb-8">
          <Zap className="w-3.5 h-3.5 animate-pulse" />
          Нова колекція 2026
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-8">
          <span className="text-zinc-900">Знайди все,</span>
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-600 to-indigo-600">
            що потрібно
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-600 max-w-xl mb-12 leading-relaxed font-light">
          Тисячі товарів за найкращими цінами. Швидка доставка та гарантія
          якості на кожну покупку. Почни свій шопінг прямо зараз.
        </p>

        <div className="flex items-center gap-5 py-4">
          <Link
            href="/catalog"
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-full text-base transition-all shadow-lg shadow-violet-600/10 active:scale-95 cursor-pointer"
          >
            В каталог
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 font-medium rounded-full text-base transition-all active:scale-95 bg-white cursor-pointer"
          >
            Акції
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
