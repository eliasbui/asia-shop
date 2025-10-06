import { queryOptions } from '@tanstack/react-query';

import { apiFetch } from '@/lib/api/fetcher';
import {
  orderSchema,
  payoutSchema,
  productSchema,
  revenueSnapshotSchema
} from './types';

export const productsQuery = (options?: { status?: string; page?: number; size?: number }) =>
  queryOptions({
    queryKey: ['products', options],
    queryFn: () =>
      apiFetch('/seller/products', {
        schema: productSchema.array(),
        query: {
          status: options?.status,
          page: options?.page ?? 1,
          size: options?.size ?? 20
        }
      }),
    staleTime: 5 * 60 * 1000
  });

export const ordersQuery = (options?: { status?: string }) =>
  queryOptions({
    queryKey: ['orders', options],
    queryFn: () =>
      apiFetch('/seller/orders', {
        schema: orderSchema.array(),
        query: { status: options?.status }
      }),
    staleTime: 60 * 1000
  });

export const payoutsQuery = queryOptions({
  queryKey: ['payouts'],
  queryFn: () => apiFetch('/seller/payouts', { schema: payoutSchema.array() }),
  staleTime: 5 * 60 * 1000
});

export const revenueSummaryQuery = (options: { period: 'daily' | 'weekly' | 'monthly' }) =>
  queryOptions({
    queryKey: ['revenue-summary', options],
    queryFn: () =>
      apiFetch('/seller/reports/revenue', {
        schema: revenueSnapshotSchema,
        query: { period: options.period }
      }),
    staleTime: 2 * 60 * 1000
  });
