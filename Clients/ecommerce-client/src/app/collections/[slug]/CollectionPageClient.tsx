'use client';

import { useState, useMemo } from 'react';
import { CollectionHero } from '@/components/collections/CollectionHero';
import { CollectionGrid } from '@/components/collections/CollectionGrid';
import { CollectionFilters } from '@/components/collections/CollectionFilters';
import { CollectionSort } from '@/components/collections/CollectionSort';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getProductsByCollection } from '@/lib/data/collections';
import { Filter, Grid, X } from 'lucide-react';
import { Collection } from '@/lib/types/collections';
import { Product } from '@/lib/types/domain';

interface CollectionPageClientProps {
  collection: Collection;
}

export function CollectionPageClient({ collection }: CollectionPageClientProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [gridColumns, setGridColumns] = useState(4);
  const [sortBy, setSortBy] = useState('featured');

  // Get products and apply filters
  const allProducts = getProductsByCollection(collection.slug);

  const filteredProducts = useMemo(() => {
    let products = allProducts;

    // Apply filters
    if (Object.keys(activeFilters).length > 0) {
      products = products.filter(product => {
        return Object.entries(activeFilters).every(([filterId, filterValue]) => {
          const filter = collection.filters?.find(f => f.id === filterId);
          if (!filter) return true;

          if (filter.type === 'checkbox' && Array.isArray(filterValue)) {
            if (filter.field === 'attributes.color') {
              return filterValue.some((color: string) =>
                product.attributes.color?.includes(color)
              );
            }
            if (filter.field === 'attributes.size') {
              return filterValue.some((size: string) =>
                product.attributes.size?.includes(size)
              );
            }
            if (filter.field === 'brand') {
              return filterValue.includes(product.brand);
            }
          }

          if (filter.type === 'select') {
            if (filter.field === 'attributes.style') {
              return product.attributes.style === filterValue;
            }
            if (filter.field === 'attributes.material') {
              return product.attributes.material === filterValue;
            }
          }

          if (filter.type === 'range' && Array.isArray(filterValue)) {
            const [min, max] = filterValue;
            const price = product.price.list.amount;
            return price >= min && price <= max;
          }

          return true;
        });
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low-high':
        return [...products].sort((a, b) =>
          (a.price.sale?.amount || a.price.list.amount) - (b.price.sale?.amount || b.price.list.amount)
        );
      case 'price-high-low':
        return [...products].sort((a, b) =>
          (b.price.sale?.amount || b.price.list.amount) - (a.price.sale?.amount || a.price.list.amount)
        );
      case 'name-az':
        return [...products].sort((a, b) => a.title.localeCompare(b.title));
      case 'name-za':
        return [...products].sort((a, b) => b.title.localeCompare(a.title));
      case 'rating':
        return [...products].sort((a, b) => b.rating - a.rating);
      case 'newest':
        return [...products].sort((a, b) =>
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );
      case 'featured':
      default:
        // For featured, prioritize products with badges like 'bestseller' and 'new'
        return [...products].sort((a, b) => {
          const aHasBadges = a.badges && a.badges.length > 0;
          const bHasBadges = b.badges && b.badges.length > 0;
          if (aHasBadges && !bHasBadges) return -1;
          if (!aHasBadges && bHasBadges) return 1;
          return 0;
        });
    }
  }, [allProducts, activeFilters, collection.filters, sortBy]);

  const handleFilterChange = (filters: Record<string, any>) => {
    setActiveFilters(filters);
  };

  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };

  const breadcrumbItems = [
    { label: 'Collections', href: '/collections' },
    { label: collection.title }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Collection Hero */}
      <CollectionHero
        collection={collection}
        productCount={filteredProducts.length}
      />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Collection Content */}
      <div className="container mx-auto px-4 pb-8">
        {/* Collection Info Bar */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {collection.title}
                </h1>
                {collection.metadata.featured && (
                  <Badge variant="default">Featured</Badge>
                )}
              </div>
              <p className="text-gray-600 max-w-2xl">
                {collection.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <span className="text-sm text-gray-500">
                  {filteredProducts.length} of {allProducts.length} products
                </span>
                <div className="flex flex-wrap gap-1">
                  {collection.metadata.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* View Options */}
            <div className="flex items-center gap-4">
              <CollectionSort
                onSortChange={handleSortChange}
                className="hidden lg:flex"
              />
              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant={gridColumns === 3 ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setGridColumns(3)}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={gridColumns === 4 ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setGridColumns(4)}
                    className="rounded-l-none"
                  >
                    <Grid className="h-4 w-4" />
                    <Grid className="h-4 w-4 -ml-2" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {Object.keys(activeFilters).length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                      {Object.keys(activeFilters).length}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sort Bar */}
        <div className="lg:hidden bg-white border rounded-lg p-4 mb-6">
          <CollectionSort onSortChange={handleSortChange} />
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`
            ${showFilters ? 'block' : 'hidden'}
            lg:block lg:w-80 flex-shrink-0
          `}>
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                {Object.keys(activeFilters).length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <CollectionFilters
                filters={collection.filters || []}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Bar */}
            {showFilters && (
              <div className="lg:hidden bg-white border rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CollectionFilters
                  filters={collection.filters || []}
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                />
              </div>
            )}

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <CollectionGrid
                products={filteredProducts}
                columns={gridColumns}
              />
            ) : (
              <div className="bg-white rounded-lg border p-12 text-center">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your filters to see more products.
                  </p>
                  <Button variant="outline" onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}