"use client";

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';

import { ErrorBox } from '@/components/shared/error-box';
import { Skeleton } from '@/components/shared/skeleton';
import { Button } from '@/components/ui/button';
import { revenueSummaryQuery } from '@/lib/api/seller/queries';

import { DashboardCard } from './dashboard-card';
import { RevenueChart } from './revenue-chart';

export function DashboardOverview() {
  const t = useTranslations('dashboard');
  const { data, isLoading, isError, refetch } = useQuery(revenueSummaryQuery({ period: 'monthly' }));

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isError || !data) {
    return <ErrorBox message="Failed to load revenue" onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title={t('revenue')} value={`$${data.net.toLocaleString()}`} delta={12} trend="up" />
        <DashboardCard title={t('orders')} value="1,245" delta={5} trend="up" />
        <DashboardCard title={t('conversion')} value="2.9%" delta={-0.4} trend="down" />
        <DashboardCard title={t('lowStock')} value="12 SKUs" description="Restock recommended" />
      </div>
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{t('title')}</h3>
            <p className="text-xs text-muted-foreground">30-day sales trend</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
        <RevenueChart
          currency="USD"
          data={Array.from({ length: 8 }, (_, index) => ({
            label: `W${index + 1}`,
            value: data.net - index * 420
          }))}
        />
      </div>
    </div>
  );
}
