"use client";

import { useQuery } from '@tanstack/react-query';

import { ErrorBox } from '@/components/shared/error-box';
import { Skeleton } from '@/components/shared/skeleton';
import { ordersQuery } from '@/lib/api/seller/queries';

import { OrderTable } from './order-table';

interface OrdersPanelProps {
  locale: string;
}

export function OrdersPanel({ locale }: OrdersPanelProps) {
  const { data, isLoading, isError, refetch } = useQuery(ordersQuery());

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (isError) {
    return <ErrorBox message="Unable to load orders" onRetry={() => refetch()} />;
  }

  return <OrderTable data={data ?? []} locale={locale} />;
}
