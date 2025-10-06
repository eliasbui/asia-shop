"use client";

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';

import { ErrorBox } from '@/components/shared/error-box';
import { Skeleton } from '@/components/shared/skeleton';
import { Button } from '@/components/ui/button';
import { productsQuery } from '@/lib/api/seller/queries';

import { ProductTable } from './product-table';

export function ProductsPanel() {
  const t = useTranslations('common');
  const { data, isLoading, isError, refetch } = useQuery(productsQuery({ status: 'active' }));

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isError) {
    return <ErrorBox message="Failed to load products" onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('viewAll')}</h2>
        <Button size="sm">Create product</Button>
      </div>
      <ProductTable data={data ?? []} onCreate={() => {}} />
    </div>
  );
}
