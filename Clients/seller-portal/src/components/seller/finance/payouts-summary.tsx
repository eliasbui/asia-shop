"use client";

import { useQuery } from '@tanstack/react-query';

import { ErrorBox } from '@/components/shared/error-box';
import { Skeleton } from '@/components/shared/skeleton';
import { payoutsQuery } from '@/lib/api/seller/queries';

import { PayoutCard } from './payout-card';

export function PayoutsSummary() {
  const { data, isLoading, isError, refetch } = useQuery(payoutsQuery);

  if (isLoading) {
    return <Skeleton className="h-52 w-full" />;
  }

  if (isError || !data?.length) {
    return <ErrorBox message="No payout data" onRetry={() => refetch()} />;
  }

  return <PayoutCard payout={data[0]} />;
}
