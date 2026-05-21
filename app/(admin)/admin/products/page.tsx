import { getProducts } from "@/src/modules/products/product.actions";
import AdminProductList from "@/src/modules/products/components/AdminProductList";

export default async function ProductsPage() {
  const res = await getProducts();
  const products = res.success ? res.data : [];

  return (
    <div className="space-y-6">
      <AdminProductList initialProducts={products} />
    </div>
  );
}
