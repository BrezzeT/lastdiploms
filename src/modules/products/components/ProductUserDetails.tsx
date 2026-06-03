import { ChevronLeft } from "lucide-react";
import { Product } from "../../shared/types";
import Link from "next/link";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductUserDetails({ product }: ProductDetailsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Назад до каталогу
      </Link>
    </div>
  );
}
