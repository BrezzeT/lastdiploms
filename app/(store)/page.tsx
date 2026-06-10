import Hero from "@/src/modules/home/Hero";
import HomeCategories from "@/src/modules/home/HomeCategories";
import FeaturedProducts from "@/src/modules/home/FeaturedProducts";
import {
  getCategoryCounts,
  getProducts,
} from "@/src/modules/products/product.actions";
import { Product } from "@/src/modules/shared/types";
import NewProducts from "@/src/modules/home/NewProducts";

export default async function StoreFront() {
  const countsResponse = await getCategoryCounts();
  const counts = countsResponse.success ? countsResponse.data : {};

  const productsResponse = await getProducts();
  const allProducts = productsResponse.success
    ? (productsResponse.data as Product[])
    : [];
  const featuredProducts = allProducts.filter((product) => product.isFeatured);
  const newFilter = [...allProducts]
    .sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
    )
    .slice(0, 4);

  return (
    <div className="space-y-8 md:space-y-16">
      <Hero />
      <div className="">
        <HomeCategories counts={counts} />
        <FeaturedProducts products={featuredProducts} />
        <NewProducts products={newFilter} />
      </div>
    </div>
  );
}
