import { getProductById } from "@/src/modules/products/product.actions";
import ProductUserDetails from "@/src/modules/products/components/ProductUserDetails";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const res = await getProductById(id);
  if (!res.success || !res.data) {
    notFound();
  }
  return <ProductUserDetails product={res.data} />;
}
