import { Suspense } from 'react';

import { ProductsPanel } from '@/components/seller/products/products-panel';
import { Skeleton } from '@/components/shared/skeleton';

export const revalidate = 300;

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Products</h1>
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <ProductsPanel />
      </Suspense>
    </div>
  );
}
