import { HeroBanner } from '@/components/common/HeroBanner';
import { FlashSaleSection } from '@/components/home/FlashSaleSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { TrendingKeywords } from '@/components/home/TrendingKeywords';
import { BrandShowcase } from '@/components/home/BrandShowcase';

export default function Home() {
  return (
    <div className="space-y-12">
      <HeroBanner />
      <FlashSaleSection />
      <CategoriesSection />
      <FeaturedProducts />
      <TrendingKeywords />
      <BrandShowcase />
    </div>
  );
}
