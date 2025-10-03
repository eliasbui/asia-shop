'use client';

import React from 'react';
import { Skeleton, TextSkeleton, AvatarSkeleton } from './LoadingSkeleton';
import { cn } from '@/lib/utils/cn';

export interface ProductListSkeletonProps {
  className?: string;
  items?: number;
  layout?: 'grid' | 'list' | 'compact';
  showFilters?: boolean;
  showPagination?: boolean;
  showSort?: boolean;
  animation?: 'shimmer' | 'pulse' | 'wave' | 'none';
}

export function ProductListSkeleton({
  className = '',
  items = 12,
  layout = 'grid',
  showFilters = true,
  showPagination = true,
  showSort = true,
  animation = 'shimmer',
}: ProductListSkeletonProps) {
  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex-1">
        <Skeleton
          variant="text"
          height="2rem"
          width="200px"
          animation={animation}
        />
        <Skeleton
          variant="text"
          height="1rem"
          width="150px"
          className="mt-2"
          animation={animation}
        />
      </div>

      {showSort && (
        <div className="flex items-center space-x-4">
          <Skeleton
            variant="rectangular"
            height="2.5rem"
            width="150px"
            animation={animation}
          />
          <Skeleton
            variant="rectangular"
            height="2.5rem"
            width="100px"
            animation={animation}
          />
        </div>
      )}
    </div>
  );

  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="hidden lg:block">
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <Skeleton
            variant="text"
            height="1.5rem"
            width="120px"
            animation={animation}
          />

          <div className="space-y-6 mt-6">
            {/* Categories */}
            <div>
              <Skeleton
                variant="text"
                height="1rem"
                width="80px"
                animation={animation}
              />
              <div className="mt-3 space-y-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Skeleton
                      variant="rectangular"
                      width="16px"
                      height="16px"
                      animation={animation}
                    />
                    <Skeleton
                      variant="text"
                      height="1rem"
                      width="100px"
                      animation={animation}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <Skeleton
                variant="text"
                height="1rem"
                width="80px"
                animation={animation}
              />
              <div className="mt-3 space-y-2">
                <Skeleton
                  variant="rectangular"
                  height="2rem"
                  width="100%"
                  animation={animation}
                />
                <Skeleton
                  variant="rectangular"
                  height="2rem"
                  width="100%"
                  animation={animation}
                />
              </div>
            </div>

            {/* Brands */}
            <div>
              <Skeleton
                variant="text"
                height="1rem"
                width="60px"
                animation={animation}
              />
              <div className="mt-3 space-y-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Skeleton
                      variant="rectangular"
                      width="16px"
                      height="16px"
                      animation={animation}
                    />
                    <Skeleton
                      variant="text"
                      height="1rem"
                      width="80px"
                      animation={animation}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderListItems = () => {
    if (layout === 'list') {
      return (
        <div className="space-y-4">
          {Array.from({ length: items }, (_, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex space-x-4">
                {/* Product Image */}
                <Skeleton
                  variant="rectangular"
                  width="120px"
                  height="120px"
                  animation={animation}
                />

                {/* Product Info */}
                <div className="flex-1 space-y-3">
                  <Skeleton
                    variant="text"
                    height="1.25rem"
                    width="60%"
                    animation={animation}
                  />
                  <Skeleton
                    variant="text"
                    height="1rem"
                    width="30%"
                    animation={animation}
                  />
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }, (_, starIndex) => (
                        <Skeleton
                          key={starIndex}
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
                      width="40px"
                      animation={animation}
                    />
                  </div>
                  <TextSkeleton lines={2} animation={animation} />
                  <div className="flex items-center space-x-4">
                    <Skeleton
                      variant="text"
                      height="1.5rem"
                      width="80px"
                      animation={animation}
                    />
                    <Skeleton
                      variant="rectangular"
                      height="2rem"
                      width="120px"
                      animation={animation}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (layout === 'compact') {
      return (
        <div className="space-y-3">
          {Array.from({ length: items }, (_, index) => (
            <div key={index} className="bg-white rounded border border-gray-200 p-3">
              <div className="flex items-center space-x-3">
                <Skeleton
                  variant="rectangular"
                  width="60px"
                  height="60px"
                  animation={animation}
                />
                <div className="flex-1 space-y-2">
                  <Skeleton
                    variant="text"
                    height="1rem"
                    width="70%"
                    animation={animation}
                  />
                  <Skeleton
                    variant="text"
                    height="1rem"
                    width="40%"
                    animation={animation}
                  />
                </div>
                <Skeleton
                  variant="text"
                  height="1.25rem"
                  width="60px"
                  animation={animation}
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Default grid layout
    const getGridColumns = () => {
      switch (layout) {
        case 'grid':
        default:
          return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      }
    };

    return (
      <div className={cn('grid gap-4 sm:gap-6', getGridColumns())}>
        {Array.from({ length: items }, (_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100">
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation={animation}
              />
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              <Skeleton
                variant="text"
                height="1.25rem"
                width="85%"
                animation={animation}
              />
              <Skeleton
                variant="text"
                height="1rem"
                width="40%"
                animation={animation}
              />
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }, (_, starIndex) => (
                    <Skeleton
                      key={starIndex}
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
              <div className="flex items-center space-x-2">
                <Skeleton
                  variant="text"
                  height="1.5rem"
                  width="70px"
                  animation={animation}
                />
                <Skeleton
                  variant="text"
                  height="1rem"
                  width="50px"
                  animation={animation}
                />
              </div>
              <Skeleton
                variant="rectangular"
                height="2rem"
                width="100%"
                animation={animation}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    if (!showPagination) return null;

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <div className="flex items-center space-x-2">
          <Skeleton
            variant="text"
            height="1rem"
            width="100px"
            animation={animation}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Skeleton
            variant="rectangular"
            height="2.5rem"
            width="40px"
            animation={animation}
          />
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height="2.5rem"
              width="40px"
              animation={animation}
            />
          ))}
          <Skeleton
            variant="rectangular"
            height="2.5rem"
            width="40px"
            animation={animation}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={cn('w-full', className)}>
      {renderHeader()}

      <div className="flex gap-6">
        {renderFilters()}

        <div className="flex-1">
          {renderListItems()}
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}

// Mobile filter skeleton
export function MobileFilterSkeleton({ animation = 'shimmer' }: { animation?: SkeletonProps['animation'] }) {
  return (
    <div className="lg:hidden bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between">
        <Skeleton
          variant="text"
          height="1.5rem"
          width="100px"
          animation={animation}
        />
        <Skeleton
          variant="rectangular"
          height="2rem"
          width="80px"
          animation={animation}
        />
      </div>
    </div>
  );
}