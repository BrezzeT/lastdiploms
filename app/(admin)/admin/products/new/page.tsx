"use server";
import ProductAddForm from "@/src/modules/products/components/ProductAddForm";

export default async function NewProductPage() {
  return (
    <div>
      <ProductAddForm />
    </div>
  );
}
