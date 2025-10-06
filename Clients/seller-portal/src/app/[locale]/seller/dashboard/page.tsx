import { Suspense } from 'react';

import { DashboardOverview } from '@/components/seller/dashboard/dashboard-overview';
import { PayoutsSummary } from '@/components/seller/finance/payouts-summary';
import { OrdersPanel } from '@/components/seller/orders/orders-panel';
import { ProductsPanel } from '@/components/seller/products/products-panel';
import { Skeleton } from '@/components/shared/skeleton';

export const revalidate = 120;

export default function DashboardPage({ params }: { params: { locale: string } }) {
  return (
    <div className="space-y-8">
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <DashboardOverview />
      </Suspense>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <ProductsPanel />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <OrdersPanel locale={params.locale} />
          </Suspense>
        </div>
        <Suspense fallback={<Skeleton className="h-52 w-full" />}>
          <PayoutsSummary />
        </Suspense>
      </div>
    </div>
  );
}
