import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroBanner } from "@/components/common/hero-banner";
import { CategoriesGrid } from "@/components/common/category-card";
import { FlashSaleSection } from "@/components/common/flash-sale-section";
import { TrendingKeywords } from "@/components/common/trending-keywords";
import { SectionHeader } from "@/components/common/section-header";
import { ProductGrid } from "@/components/product/product-grid";
import {
  mockBannerSlides,
  mockCategories,
  mockProducts,
  mockTrendingKeywords,
} from "@/lib/api/mock-data";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Enable static rendering
  setRequestLocale(locale);
  const t = await getTranslations("common");

  // Filter products for different sections
  const flashSaleProducts = mockProducts.filter((p) =>
    p.badges?.includes("flashSale")
  );
  const newProducts = mockProducts.filter((p) => p.badges?.includes("new"));
  const bestsellerProducts = mockProducts.filter((p) =>
    p.badges?.includes("bestseller")
  );

  // Get flash sale end date (earliest from flash sale products)
  const flashSaleEndDate =
    flashSaleProducts[0]?.price.flashSale?.endsAt ||
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Banner */}
      <section className="container mx-auto px-4 py-8">
        <HeroBanner slides={mockBannerSlides} />
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8">
        <SectionHeader
          title="Shop by Category"
          description="Browse our wide range of products"
          viewAllHref="/categories"
          viewAllText={t("viewAll")}
        />
        <CategoriesGrid categories={mockCategories} />
      </section>

      {/* Flash Sale */}
      {flashSaleProducts.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <FlashSaleSection
            products={flashSaleProducts}
            endDate={flashSaleEndDate}
          />
        </section>
      )}

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <SectionHeader
            title="New Arrivals"
            description="Check out the latest products"
            viewAllHref="/new"
            viewAllText={t("viewAll")}
          />
          <ProductGrid products={newProducts} />
        </section>
      )}

      {/* Bestsellers */}
      {bestsellerProducts.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <SectionHeader
            title="Bestsellers"
            description="Most popular products"
            viewAllHref="/bestsellers"
            viewAllText={t("viewAll")}
          />
          <ProductGrid products={bestsellerProducts} />
        </section>
      )}

      {/* Trending Keywords */}
      <section className="container mx-auto px-4 py-8">
        <TrendingKeywords keywords={mockTrendingKeywords} />
      </section>
    </main>
  );
}
