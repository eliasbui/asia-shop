'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin text-primary', sizeClasses[size], className)}
    />
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
