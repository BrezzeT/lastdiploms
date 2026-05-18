"use server";
import ProductCard from "@/src/components/shared/ProductCard";
import { Product as ProductType } from "@/src/types";
import { getProducts } from "@/src/lib/actions/product.actions";

export default async function CatalogPage() {
  const res = await getProducts();
  const products = res.success ? res.data : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product: ProductType) => (
        <ProductCard key={product._id} product={product} isAdmin={false} />
      ))}
    </div>
  );
}
