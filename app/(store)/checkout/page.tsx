"use client";

import dynamic from "next/dynamic";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const CheckoutForm = dynamic(
  async () => {
    await new Promise((r) => setTimeout(r, 1000));
    return import("@/src/modules/orders/components/CheckoutForm");
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
    <div className="space-y-8 ">
      <div className="flex flex-col gap-3 border-b border-zinc-200 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 self-start px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-all text-xs font-bold shadow-xs border border-zinc-200"
        >
          <ChevronLeft className="w-4 h-4" />
          Повернутись до покупок
        </Link>
        <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">
          Оформлення замовлення
        </h1>
      </div>

      <CheckoutForm />
    </div>
  );
}
