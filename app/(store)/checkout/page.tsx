"use client";

import dynamic from "next/dynamic";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const CheckoutForm = dynamic(
  async () => {
    await new Promise((r) => setTimeout(r, 1000));
    return import("@/src/components/store/CheckoutForm");
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-96 flex items-center justify-center text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">
        Завантаження форми...
      </div>
    ),
  },
);

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center flex-col md:flex-row gap-4 justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Повернутись до покупок
        </Link>
        <h1 className="text-xl font-bold text-white uppercase tracking-tight">
          Оформлення замовлення
        </h1>
      </div>

      <CheckoutForm />
    </div>
  );
}
