import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function StoreFront() {
  return (
    <section className="pt-32 pb-40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/10 bg-violet-500/5 text-violet-600 text-[13px] font-semibold mb-8">
          <Zap className="w-3.5 h-3.5" />
          Нова колекція 2026
        </div>

        <h1 className="text-7xl font-extrabold leading-[1.1] tracking-tight mb-8">
          <span className="text-zinc-900">Знайди все,</span>
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-600 to-indigo-600">
            що потрібно
          </span>
        </h1>

        <p className="text-xl text-zinc-600 max-w-xl mb-12 leading-relaxed font-light">
          Тисячі товарів за найкращими цінами. Швидка доставка та гарантія
          якості на кожну покупку. Почни свій шопінг прямо зараз.
        </p>

        <div className="flex items-center gap-5">
          <Link
            href="/catalog"
            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-2xl text-sm transition-all shadow-lg shadow-violet-600/10 active:scale-95"
          >
            Перейти до каталогу
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-8 py-4 border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 font-medium rounded-2xl text-sm transition-all active:scale-95 bg-white"
          >
            Акційні пропозиції
          </Link>
        </div>
      </div>
    </section>
  );
}
