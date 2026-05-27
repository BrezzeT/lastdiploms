import AnimationProductGrid from "@/src/modules/products/components/AnimationProductGrid";
import { getProducts } from "@/src/modules/products/product.actions";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const res = await getProducts();
  const products = res.success ? res.data : [];

  return (
    <div className="space-y-10">
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
