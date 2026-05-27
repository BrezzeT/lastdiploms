import Hero from "@/src/modules/home/Hero";
import HomeCategories from "@/src/modules/home/HomeCategories";
import FeaturedProducts from "@/src/modules/home/FeaturedProducts";
import {
  getCategoryCounts,
  getProducts,
} from "@/src/modules/products/product.actions";
import { Product } from "@/src/modules/layout/shared/types";

export default async function StoreFront() {
  const countsResponse = await getCategoryCounts();
  const counts = countsResponse.success ? countsResponse.data : {};

  const productsResponse = await getProducts();
  const allProducts = productsResponse.success
    ? (productsResponse.data as Product[])
    : [];
  const featuredProducts = allProducts.filter((product) => product.isFeatured);

  return (
    <div className="space-y-8 md:space-y-16">
      <Hero />
      <div className="">
        <HomeCategories counts={counts} />
        <FeaturedProducts products={featuredProducts} />
      </div>
    </div>
  );
}
