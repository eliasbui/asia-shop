"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { Skeleton } from '@/components/shared/skeleton';

const LazyRevenueChart = dynamic(() => import('./revenue-chart.client'), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full" />
});

interface Point {
  label: string;
  value: number;
}

interface RevenueChartProps {
  data: Point[];
  currency?: string;
}

export function RevenueChart({ data, currency = 'USD' }: RevenueChartProps) {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <LazyRevenueChart data={data} currency={currency} />
    </Suspense>
  );
}
