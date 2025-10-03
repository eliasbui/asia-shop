import { Metadata } from 'next';
import { CollectionCard } from '@/components/collections/CollectionCard';
import { Button } from '@/components/ui/button';
import { getCollections, getFeaturedCollections } from '@/lib/data/collections';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Collections | AsiaShop - Curated Fashion Collections',
  description: 'Discover our curated collections, each thoughtfully designed to inspire and delight. From seasonal essentials to timeless classics, find your perfect style across our diverse range.',
  keywords: ['collections', 'fashion', 'curated', 'seasonal', 'style', 'essentials', 'vintage', 'urban', 'streetwear'],
  openGraph: {
    title: 'Collections | AsiaShop',
    description: 'Explore our curated fashion collections featuring the latest trends and timeless classics.',
    type: 'website',
  },
};

export default function CollectionsPage() {
  const allCollections = getCollections();
  const featuredCollections = getFeaturedCollections();
  const regularCollections = allCollections.filter(
    collection => !collection.metadata.featured
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Collections
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover our curated collections, each thoughtfully designed to inspire
              and delight. From seasonal essentials to timeless classics, find your
              perfect style across our diverse range.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2">
                Shop All Collections
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Lookbook
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      {featuredCollections.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Collections
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our hand-picked selections showcasing the latest trends and timeless favorites.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Collections */}
      {regularCollections.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                All Collections
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our complete range of collections, each with its own unique story and style.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularCollections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Collection Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {allCollections.length}
              </div>
              <div className="text-gray-600">Collections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {allCollections.reduce((sum, col) => sum + col.metadata.productCount, 0)}
              </div>
              <div className="text-gray-600">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {featuredCollections.length}
              </div>
              <div className="text-gray-600">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                4
              </div>
              <div className="text-gray-600">Seasons</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Inspired
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Get the latest updates on new collections, exclusive offers, and style inspiration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}