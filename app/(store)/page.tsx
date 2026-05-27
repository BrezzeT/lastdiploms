import Hero from "@/src/modules/home/Hero";
import HomeCategories from "@/src/modules/home/HomeCategories";
import { getCategoryCounts } from "@/src/modules/products/product.actions";

export default async function StoreFront() {
  const countsResponse = await getCategoryCounts();
  const counts = countsResponse.success ? countsResponse.data : {};

  return (
    <div className="space-y-16">
      <Hero />
      <div className="max-w-7xl mx-auto ">
        <HomeCategories counts={counts} />
      </div>
    </div>
  );
}
