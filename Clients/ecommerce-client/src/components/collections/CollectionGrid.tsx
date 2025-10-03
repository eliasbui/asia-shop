'use client';

import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/lib/types/domain';
import { CollectionGridProps } from '@/lib/types/collections';
import { cn } from '@/lib/utils/cn';

export function CollectionGrid({
  products,
  columns = 4,
  className = ''
}: CollectionGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or browse our other collections.
          </p>
        </div>
      </div>
    );
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
  };

  return (
    <div className={cn(
      'grid gap-6',
      gridCols[columns as keyof typeof gridCols] || gridCols[4],
      className
    )}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          className="w-full"
        />
      ))}
    </div>
  );
}