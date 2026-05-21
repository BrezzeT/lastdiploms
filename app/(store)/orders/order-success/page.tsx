import { getOrderById } from "@/src/modules/orders/order.actions";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  CreditCard,
  Wallet,
  Home,
} from "lucide-react";
import Link from "next/link";

export interface OrderSuccessPageProps {
  searchParams: Promise<{
    id?: string;
    payment?: string;
  }>;
}
export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const params = await searchParams;
  const orderId = params.id;

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Замовлення не знайдено</p>
      </div>
    );
  }
  const res = await getOrderById(orderId);

  if (!res.success || !res.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Замовлення з таким ID не існує</p>
      </div>
    );
  }

  const order = res.data;
  const isPaid = order.paymentStatus === "balance";

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-center">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div
            className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${isPaid ? "bg-emerald-50 border-4 border-emerald-100" : "bg-amber-50 border-4 border-amber-100"}`}
          >
            {isPaid ? (
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            ) : (
              <Clock className="w-12 h-12 text-amber-500" />
            )}
          </div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-3">
            {isPaid ? "Замовлення оплачено!" : "Замовлення прийнято!"}
          </h1>
          <p className="text-zinc-500 text-base">
            {isPaid
              ? "Ваш баланс списано. Чекайте на відправку."
              : "Оплатіть при отриманні. Ми вже готуємо ваше замовлення."}
          </p>
          <div className="mt-3 inline-block px-4 py-1.5 bg-zinc-100 rounded-full text-xs font-black text-zinc-500 tracking-widest uppercase">
            #{orderId.slice(-8).toUpperCase()}
          </div>
        </div>
        <div className="bg-white border border-zinc-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-5">
              Що далі?
            </h3>
            <div className="space-y-5">
              {isPaid ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-zinc-800">
                        Оплата підтверджена
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Кошти списано з балансу
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-500 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-zinc-800">
                        Комплектація
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Збираємо ваше замовлення
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-zinc-800">
                        Відправка на ТНТ
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Трекінг-номер надійде в Telegram
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-zinc-800">
                        Очікуємо оплату
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Оплатіть кур&apos;єру при отриманні
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-500 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-zinc-800">
                        Комплектація
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Збираємо ваше замовлення
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-zinc-800">
                        Доставка на ТНТ
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Ваше замовлення приїде найближчим часом
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div
            className={`px-6 py-4 ${isPaid ? "bg-emerald-50/50 border-t border-emerald-100/50" : "bg-amber-50/50 border-t border-amber-100/50"}`}
          >
            <p
              className={`text-base font-bold text-center ${isPaid ? "text-emerald-600" : "text-amber-600"}`}
            >
              {isPaid
                ? "✓ Оплата пройшла успішно — слідкуйте за статусом у профілі"
                : "⏳ Ми зв'яжемося з вами для підтвердження замовлення"}
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="w-full py-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-full font-black text-sm uppercase tracking-widest transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 group shadow-xl shadow-zinc-950/10"
        >
          <Home className="w-4 h-4" />
          На головну
        </Link>
      </div>
    </div>
  );
}
