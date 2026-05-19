import ProductCard from "@/src/components/shared/ProductCard";
import { Product as ProductType } from "@/src/types";
import { getProducts } from "@/src/lib/actions/product.actions";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const res = await getProducts();
  const products = res.success ? res.data : [];

  return (
    <div className="space-y-10 py-6">
      <div className="border-b border-zinc-200/40 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/10 bg-violet-500/5 text-violet-600 text-sm font-semibold mb-3">
            <Sparkles className="w-4 h-4 animate-bounce" />
            Оберіть найкраще
          </div>
          <h2 className="text-4xl font-extrabold text-zinc-950 tracking-tight">
            Каталог товарів
          </h2>
          <p className="text-zinc-500 text-sm mt-1.5 max-w-xl font-medium">
            Знайдіть найкращі пропозиції для вашого бізнесу та дому. Лише
            сертифіковані та якісні товари з гарантією.
          </p>
        </div>
        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest bg-zinc-100 rounded-full px-4 py-2 shrink-0 self-start md:self-auto shadow-xs border border-zinc-200/30">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product: ProductType) => (
            <ProductCard key={product._id} product={product} isAdmin={false} />
          ))}
        </div>
      )}
    </div>
  );
}
