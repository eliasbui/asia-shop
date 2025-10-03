'use client';

import React from 'react';
import { Skeleton } from './LoadingSkeleton';
import { cn } from '@/lib/utils/cn';

export interface CartSkeletonProps {
  className?: string;
  items?: number;
  showSummary?: boolean;
  showActions?: boolean;
  animation?: 'shimmer' | 'pulse' | 'wave' | 'none';
  layout?: 'page' | 'sidebar' | 'modal';
}

export function CartSkeleton({
  className = '',
  items = 3,
  showSummary = true,
  showActions = true,
  animation = 'shimmer',
  layout = 'page',
}: CartSkeletonProps) {
  const isCompact = layout === 'sidebar' || layout === 'modal';

  const renderCartItem = (index: number) => (
    <div
      key={index}
      className={cn(
        'bg-white border border-gray-200 rounded-lg p-4',
        !isCompact && 'mb-4'
      )}
    >
      <div className="flex space-x-4">
        {/* Product Image */}
        <Skeleton
          variant="rectangular"
          width={isCompact ? '60px' : '80px'}
          height={isCompact ? '60px' : '80px'}
          animation={animation}
        />

        {/* Product Details */}
        <div className="flex-1 space-y-2">
          {/* Product Name */}
          <Skeleton
            variant="text"
            height="1rem"
            width={isCompact ? '120px' : '180px'}
            animation={animation}
          />

          {/* Product Variant */}
          <Skeleton
            variant="text"
            height="0.875rem"
            width={isCompact ? '80px' : '120px'}
            animation={animation}
          />

          {/* Price and Quantity Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton
                variant="text"
                height="1.125rem"
                width="60px"
                animation={animation}
              />
              {!isCompact && (
                <Skeleton
                  variant="text"
                  height="0.875rem"
                  width="50px"
                  animation={animation}
                />
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <Skeleton
                variant="rectangular"
                width={isCompact ? '24px' : '32px'}
                height={isCompact ? '24px' : '32px'}
                animation={animation}
              />
              <Skeleton
                variant="text"
                height="1rem"
                width="20px"
                animation={animation}
              />
              <Skeleton
                variant="rectangular"
                width={isCompact ? '24px' : '32px'}
                height={isCompact ? '24px' : '32px'}
                animation={animation}
              />
            </div>
          </div>

          {/* Remove Button */}
          <Skeleton
            variant="text"
            height="0.875rem"
            width="60px"
            animation={animation}
          />
        </div>

        {/* Item Total */}
        {!isCompact && (
          <div className="text-right">
            <Skeleton
              variant="text"
              height="1.25rem"
              width="70px"
              animation={animation}
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderSummary = () => {
    if (!showSummary) return null;

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold mb-4">
          <Skeleton
            variant="text"
            height="1.5rem"
            width="120px"
            animation={animation}
          />
        </h3>

        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between">
            <Skeleton
              variant="text"
              height="1rem"
              width="80px"
              animation={animation}
            />
            <Skeleton
              variant="text"
              height="1rem"
              width="80px"
              animation={animation}
            />
          </div>

          {/* Shipping */}
          <div className="flex justify-between">
            <Skeleton
              variant="text"
              height="1rem"
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

          {/* Tax */}
          <div className="flex justify-between">
            <Skeleton
              variant="text"
              height="1rem"
              width="60px"
              animation={animation}
            />
            <Skeleton
              variant="text"
              height="1rem"
              width="60px"
              animation={animation}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <Skeleton
                variant="text"
                height="1.25rem"
                width="80px"
                animation={animation}
              />
              <Skeleton
                variant="text"
                height="1.25rem"
                width="100px"
                animation={animation}
              />
            </div>
          </div>

          {/* Promo Code */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex space-x-2">
              <Skeleton
                variant="rectangular"
                height="2.5rem"
                className="flex-1"
                animation={animation}
              />
              <Skeleton
                variant="rectangular"
                height="2.5rem"
                width="100px"
                animation={animation}
              />
            </div>
          </div>

          {/* Checkout Button */}
          {showActions && (
            <div className="pt-4 space-y-2">
              <Skeleton
                variant="rectangular"
                height="3rem"
                width="100%"
                animation={animation}
              />
              <Skeleton
                variant="rectangular"
                height="2.5rem"
                width="100%"
                animation={animation}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <div className="flex justify-center mb-4">
        <Skeleton
          variant="circular"
          width="80px"
          height="80px"
          animation={animation}
        />
      </div>
      <Skeleton
        variant="text"
        height="1.5rem"
        width="150px"
        className="mx-auto mb-2"
        animation={animation}
      />
      <Skeleton
        variant="text"
        height="1rem"
        width="250px"
        className="mx-auto mb-6"
        animation={animation}
      />
      <Skeleton
        variant="rectangular"
        height="2.5rem"
        width="150px"
        className="mx-auto"
        animation={animation}
      />
    </div>
  );

  if (items === 0) {
    return (
      <div className={cn('w-full', className)}>
        {renderEmptyState()}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {layout === 'page' ? (
        // Full page layout
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {Array.from({ length: items }, (_, index) => renderCartItem(index))}
            </div>

            {showActions && (
              <div className="mt-6 flex justify-between">
                <Skeleton
                  variant="rectangular"
                  height="2.5rem"
                  width="120px"
                  animation={animation}
                />
                <Skeleton
                  variant="rectangular"
                  height="2.5rem"
                  width="150px"
                  animation={animation}
                />
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            {renderSummary()}
          </div>
        </div>
      ) : (
        // Sidebar or Modal layout
        <div className="space-y-4">
          {/* Cart Items */}
          <div className="space-y-3">
            {Array.from({ length: Math.min(items, 3) }, (_, index) => renderCartItem(index))}
          </div>

          {/* Order Summary */}
          {renderSummary()}
        </div>
      )}
    </div>
  );
}

// Shopping cart icon with loading badge
export function CartIconSkeleton({ animation = 'shimmer' }: { animation?: SkeletonProps['animation'] }) {
  return (
    <div className="relative">
      <Skeleton
        variant="rectangular"
        width="24px"
        height="24px"
        animation={animation}
      />
      <Skeleton
        variant="circular"
        width="18px"
        height="18px"
        className="absolute -top-2 -right-2"
        animation={animation}
      />
    </div>
  );
}

// Cart item skeleton for dropdown/mini cart
export function MiniCartItemSkeleton({ animation = 'shimmer' }: { animation?: SkeletonProps['animation'] }) {
  return (
    <div className="flex space-x-3 p-3 border-b border-gray-100 last:border-b-0">
      <Skeleton
        variant="rectangular"
        width="50px"
        height="50px"
        animation={animation}
      />
      <div className="flex-1 space-y-1">
        <Skeleton
          variant="text"
          height="0.875rem"
          width="100px"
          animation={animation}
        />
        <Skeleton
          variant="text"
          height="0.75rem"
          width="60px"
          animation={animation}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Skeleton
              variant="text"
              height="0.75rem"
              width="20px"
              animation={animation}
            />
            <span className="text-gray-400">×</span>
            <Skeleton
              variant="text"
              height="0.75rem"
              width="20px"
              animation={animation}
            />
          </div>
          <Skeleton
            variant="text"
            height="0.875rem"
            width="40px"
            animation={animation}
          />
        </div>
      </div>
    </div>
  );
}