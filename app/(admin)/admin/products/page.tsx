import { getProducts } from "@/src/lib/actions/product.actions";
import AdminProductList from "@/src/components/admin/AdminProductList";

export default async function ProductsPage() {
  const res = await getProducts();
  const products = res.success ? res.data : [];

  return (
    <div className="space-y-6">
      <AdminProductList initialProducts={products} />
    </div>
  );
}
