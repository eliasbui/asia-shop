'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

// Skeleton shimmer animation keyframes
const shimmerKeyframes = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`;

// Base skeleton component with shimmer effect
export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'shimmer' | 'pulse' | 'wave' | 'none';
  children?: React.ReactNode;
}

export function Skeleton({
  className = '',
  width,
  height,
  variant = 'rectangular',
  animation = 'shimmer',
  children,
}: SkeletonProps) {
  // Define base styles for different variants
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-md',
  };

  // Define animation styles
  const animationStyles = {
    shimmer: {
      background:
        'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '1000px 100%',
      animation: 'shimmer 2s infinite',
    },
    pulse: {
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
    wave: {
      background:
        'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    },
    none: {},
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
    ...animationStyles[animation],
  };

  return (
    <>
      <style jsx>{shimmerKeyframes}</style>
      <div
        className={cn(
          'bg-gray-200',
          variantStyles[variant],
          className
        )}
        style={style}
        role="status"
        aria-label="Loading content"
      >
        {children}
      </div>
    </>
  );
}

// Text skeleton with multiple lines
export interface TextSkeletonProps {
  lines?: number;
  className?: string;
  lineHeight?: string | number;
  lastLineWidth?: string | number;
  animation?: SkeletonProps['animation'];
}

export function TextSkeleton({
  lines = 3,
  className = '',
  lineHeight = '1rem',
  lastLineWidth = '70%',
  animation = 'shimmer',
}: TextSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)} aria-label="Loading text">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          variant="text"
          height={lineHeight}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          animation={animation}
        />
      ))}
    </div>
  );
}

// Avatar skeleton
export interface AvatarSkeletonProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animation?: SkeletonProps['animation'];
}

export function AvatarSkeleton({
  size = 'md',
  className = '',
  animation = 'shimmer',
}: AvatarSkeletonProps) {
  const sizeMap = {
    sm: { width: '2rem', height: '2rem' },
    md: { width: '3rem', height: '3rem' },
    lg: { width: '4rem', height: '4rem' },
    xl: { width: '6rem', height: '6rem' },
  };

  return (
    <Skeleton
      variant="circular"
      className={className}
      animation={animation}
      {...sizeMap[size]}
      aria-label="Loading avatar"
    />
  );
}

// Card skeleton base
export interface CardSkeletonProps {
  className?: string;
  header?: boolean;
  footer?: boolean;
  children?: React.ReactNode;
  animation?: SkeletonProps['animation'];
}

export function CardSkeleton({
  className = '',
  header = true,
  footer = false,
  children,
  animation = 'shimmer',
}: CardSkeletonProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 overflow-hidden',
        className
      )}
      role="status"
      aria-label="Loading card"
    >
      {header && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AvatarSkeleton size="sm" animation={animation} />
            <div className="flex-1">
              <TextSkeleton lines={1} className="w-3/4" animation={animation} />
              <TextSkeleton lines={1} className="w-1/2 mt-2" animation={animation} />
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        {children || <TextSkeleton lines={3} animation={animation} />}
      </div>

      {footer && (
        <div className="p-4 border-t border-gray-200">
          <Skeleton
            variant="rectangular"
            height="2rem"
            className="w-full"
            animation={animation}
          />
        </div>
      )}
    </div>
  );
}

// Grid skeleton for repeated items
export interface GridSkeletonProps {
  columns?: number;
  rows?: number;
  gap?: string;
  className?: string;
  children?: React.ReactNode;
  animation?: SkeletonProps['animation'];
}

export function GridSkeleton({
  columns = 3,
  rows = 2,
  gap = '1rem',
  className = '',
  children,
  animation = 'shimmer',
}: GridSkeletonProps) {
  return (
    <div
      className={cn('grid', className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
      role="status"
      aria-label={`Loading grid with ${columns} columns`}
    >
      {Array.from({ length: columns * rows }, (_, index) => (
        <div key={index}>
          {children || <Skeleton animation={animation} />}
        </div>
      ))}
    </div>
  );
}

// List skeleton for vertical lists
export interface ListSkeletonProps {
  items?: number;
  className?: string;
  itemClassName?: string;
  avatar?: boolean;
  lines?: number;
  animation?: SkeletonProps['animation'];
}

export function ListSkeleton({
  items = 5,
  className = '',
  itemClassName = '',
  avatar = true,
  lines = 2,
  animation = 'shimmer',
}: ListSkeletonProps) {
  return (
    <div className={cn('space-y-4', className)} role="status" aria-label="Loading list">
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className={cn('flex space-x-3', itemClassName)}>
          {avatar && <AvatarSkeleton size="md" animation={animation} />}
          <div className="flex-1 space-y-2">
            <TextSkeleton lines={lines} animation={animation} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Table skeleton
export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
  header?: boolean;
  animation?: SkeletonProps['animation'];
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className = '',
  header = true,
  animation = 'shimmer',
}: TableSkeletonProps) {
  return (
    <div className={cn('w-full', className)} role="status" aria-label="Loading table">
      {header && (
        <div className="flex border-b border-gray-200 pb-2 mb-4">
          {Array.from({ length: columns }, (_, index) => (
            <div key={index} className="flex-1 px-2">
              <Skeleton
                variant="text"
                height="1.5rem"
                animation={animation}
              />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={rowIndex} className="flex">
            {Array.from({ length: columns }, (_, colIndex) => (
              <div key={colIndex} className="flex-1 px-2">
                <Skeleton
                  variant="text"
                  height="1rem"
                  animation={animation}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading overlay
export interface LoadingOverlayProps {
  visible: boolean;
  children?: React.ReactNode;
  className?: string;
  backdrop?: boolean;
  text?: string;
}

export function LoadingOverlay({
  visible,
  children,
  className = '',
  backdrop = true,
  text = 'Loading...',
}: LoadingOverlayProps) {
  if (!visible) return <>{children}</>;

  return (
    <div className={cn('relative', className)}>
      {children}
      {backdrop && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            {text && (
              <p className="text-sm text-muted-foreground">{text}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}