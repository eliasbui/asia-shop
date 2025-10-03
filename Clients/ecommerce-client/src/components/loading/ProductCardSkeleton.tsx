'use client';

import React from 'react';
import { Skeleton } from './LoadingSkeleton';
import { cn } from '@/lib/utils/cn';

export interface ProductCardSkeletonProps {
  className?: string;
  showActions?: boolean;
  showQuickAdd?: boolean;
  showRating?: boolean;
  animation?: 'shimmer' | 'pulse' | 'wave' | 'none';
}

export function ProductCardSkeleton({
  className = '',
  showActions = true,
  showQuickAdd = true,
  showRating = true,
  animation = 'shimmer',
}: ProductCardSkeletonProps) {
  return (
    <div
      className={cn(
        'group relative bg-white rounded-lg border border-gray-200 overflow-hidden',
        className
      )}
      role="status"
      aria-label="Loading product"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100">
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation={animation}
        />

        {/* Badge placeholders */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Skeleton
            variant="rounded"
            width="60px"
            height="20px"
            animation={animation}
          />
          <Skeleton
            variant="rounded"
            width="80px"
            height="20px"
            animation={animation}
          />
        </div>

        {/* Action buttons placeholder */}
        {showActions && (
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <Skeleton
              variant="circular"
              width="32px"
              height="32px"
              animation={animation}
            />
            <Skeleton
              variant="circular"
              width="32px"
              height="32px"
              animation={animation}
            />
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton
          variant="text"
          height="1.25rem"
          width="85%"
          animation={animation}
        />

        {/* Brand */}
        <Skeleton
          variant="text"
          height="0.875rem"
          width="40%"
          animation={animation}
        />

        {/* Rating */}
        {showRating && (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  width="12px"
                  height="12px"
                  animation={animation}
                />
              ))}
            </div>
            <Skeleton
              variant="text"
              height="0.75rem"
              width="30px"
              animation={animation}
            />
          </div>
        )}

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton
              variant="text"
              height="1.5rem"
              width="80px"
              animation={animation}
            />
            <Skeleton
              variant="text"
              height="1rem"
              width="60px"
              animation={animation}
            />
          </div>
          <Skeleton
            variant="rounded"
            width="120px"
            height="20px"
            animation={animation}
          />
        </div>
      </div>

      {/* Quick Add to Cart */}
      {showQuickAdd && (
        <div className="px-4 pb-4">
          <Skeleton
            variant="rectangular"
            height="2.5rem"
            width="100%"
            animation={animation}
          />
        </div>
      )}
    </div>
  );
}

// Grid of product card skeletons
export interface ProductGridSkeletonProps {
  count?: number;
  columns?: number;
  gap?: string;
  className?: string;
  cardProps?: Omit<ProductCardSkeletonProps, 'className'>;
}

export function ProductGridSkeleton({
  count = 8,
  columns = 4,
  gap = '1.5rem',
  className = '',
  cardProps,
}: ProductGridSkeletonProps) {
  return (
    <div
      className={cn('grid', className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
      role="status"
      aria-label={`Loading ${count} products`}
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton
          key={index}
          {...cardProps}
        />
      ))}
    </div>
  );
}

// Responsive product grid skeleton
export function ResponsiveProductGridSkeleton({
  count = 8,
  className = '',
  cardProps,
}: Omit<ProductGridSkeletonProps, 'columns' | 'gap'>) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
        className
      )}
      role="status"
      aria-label={`Loading ${count} products`}
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton
          key={index}
          {...cardProps}
        />
      ))}
    </div>
  );
}