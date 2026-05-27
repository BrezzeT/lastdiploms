import AnimationProductGrid from "@/src/modules/products/components/AnimationProductGrid";
import { getProducts } from "@/src/modules/products/product.actions";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const res = await getProducts();
  const products = res.success ? res.data : [];

  return (
    <div className="space-y-10">
      <div className="border-b border-zinc-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
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
          Знайдено {products.length} товарів
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200/30 shadow-xs">
          <p className="text-zinc-500 text-base font-medium">
            Наразі каталог порожній. Завітайте пізніше!
          </p>
        </div>
      ) : (
        <AnimationProductGrid products={products} />
      )}
    </div>
  );
}
