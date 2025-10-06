import { Suspense } from 'react';

import { OrdersPanel } from '@/components/seller/orders/orders-panel';
import { Skeleton } from '@/components/shared/skeleton';

export const revalidate = 180;

export default function OrdersPage({ params }: { params: { locale: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <OrdersPanel locale={params.locale} />
      </Suspense>
    </div>
  );
}
