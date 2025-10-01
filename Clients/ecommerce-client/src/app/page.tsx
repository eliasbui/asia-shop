import HeroSlider from "@/components/home/hero-slider";
import CategoryGrid from "@/components/home/category-grid";
import FlashSale from "@/components/home/flash-sale";
import ProductSection from "@/components/home/product-section";
import { products } from "@/lib/mock-data";

export default function Home() {
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 10);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 10);
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 10);
  const trendingProducts = products
    .filter(p => p.rating >= 4.5 && p.reviewCount >= 50)
    .slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Slider */}
      <section className="mb-8">
        <HeroSlider />
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Danh mục nổi bật</h2>
        <CategoryGrid />
      </section>

      {/* Flash Sale */}
      <section className="mb-12">
        <FlashSale />
      </section>

      {/* Best Sellers */}
      <ProductSection
        title="Sản phẩm bán chạy"
        products={bestSellers}
        viewAllLink="/products?sort=bestseller"
      />

      {/* New Arrivals */}
      <ProductSection
        title="Sản phẩm mới"
        products={newArrivals}
        viewAllLink="/products?sort=newest"
      />

      {/* Featured Products */}
      <ProductSection
        title="Sản phẩm nổi bật"
        products={featuredProducts}
        viewAllLink="/products?featured=true"
      />

      {/* Trending Products */}
      <ProductSection
        title="Xu hướng"
        products={trendingProducts}
        viewAllLink="/products?sort=trending"
      />
    </div>
  );
}
