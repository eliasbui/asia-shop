import { Suspense } from 'react';

import { PayoutsSummary } from '@/components/seller/finance/payouts-summary';
import { Skeleton } from '@/components/shared/skeleton';

export default function PayoutsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Payouts</h1>
        <p className="text-sm text-muted-foreground">Review settlement schedule and payout history.</p>
      </div>
      <Suspense fallback={<Skeleton className="h-52 w-full" />}>
        <PayoutsSummary />
      </Suspense>
    </div>
  );
}
