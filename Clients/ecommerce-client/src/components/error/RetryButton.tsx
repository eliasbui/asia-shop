'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw, AlertTriangle, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export interface RetryButtonProps {
  onRetry: () => Promise<void> | void;
  variant?: 'default' | 'outline' | 'destructive' | 'ghost' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
  retryCount?: number;
  maxRetries?: number;
  showRetryCount?: boolean;
  errorType?: 'network' | 'api' | 'general';
  children?: React.ReactNode;
  retryText?: string;
  retryingText?: string;
  maxRetriesReachedText?: string;
}

export function RetryButton({
  onRetry,
  variant = 'outline',
  size = 'default',
  className = '',
  disabled = false,
  retryCount = 0,
  maxRetries = 3,
  showRetryCount = true,
  errorType = 'general',
  children,
  retryText = 'Try Again',
  retryingText = 'Retrying...',
  maxRetriesReachedText = 'Max retries reached',
}: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = useCallback(async () => {
    if (isRetrying || disabled || (maxRetries > 0 && retryCount >= maxRetries)) {
      return;
    }

    setIsRetrying(true);

    try {
      await onRetry();
    } catch (error) {
      // Error is handled by the caller
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  }, [onRetry, isRetrying, disabled, retryCount, maxRetries]);

  // Determine if max retries has been reached
  const maxRetriesReached = maxRetries > 0 && retryCount >= maxRetries;

  // Get appropriate icon based on error type and state
  const getIcon = () => {
    if (isRetrying) {
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    }

    switch (errorType) {
      case 'network':
        return <WifiOff className="h-4 w-4" />;
      case 'api':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  // Get button text
  const getButtonText = () => {
    if (isRetrying) return retryingText;
    if (maxRetriesReached) return maxRetriesReachedText;
    if (children) return children;
    return retryText;
  };

  // Get aria-label for accessibility
  const getAriaLabel = () => {
    if (isRetrying) return 'Retrying...';
    if (maxRetriesReached) return `Maximum retries (${maxRetries}) reached`;
    if (showRetryCount && retryCount > 0) {
      return `${retryText} (${retryCount}/${maxRetries} retries)`;
    }
    return retryText;
  };

  return (
    <Button
      onClick={handleRetry}
      variant={variant}
      size={size}
      disabled={disabled || isRetrying || maxRetriesReached}
      className={cn('gap-2', className)}
      aria-label={getAriaLabel()}
      aria-describedby={showRetryCount ? 'retry-count' : undefined}
    >
      {getIcon()}
      <span>{getButtonText()}</span>

      {showRetryCount && retryCount > 0 && !maxRetriesReached && (
        <span
          id="retry-count"
          className="text-xs text-muted-foreground ml-1"
          aria-label={`${retryCount} of ${maxRetries} retries used`}
        >
          ({retryCount}/{maxRetries})
        </span>
      )}
    </Button>
  );
}

// Specialized retry buttons for different contexts
export function NetworkRetryButton(props: Omit<RetryButtonProps, 'errorType'>) {
  return (
    <RetryButton
      errorType="network"
      retryText="Check Connection"
      retryingText="Checking..."
      {...props}
    />
  );
}

export function ApiRetryButton(props: Omit<RetryButtonProps, 'errorType'>) {
  return (
    <RetryButton
      errorType="api"
      retryText="Retry Request"
      retryingText="Retrying..."
      {...props}
    />
  );
}

export function InlineRetryButton(props: Omit<RetryButtonProps, 'size' | 'variant'>) {
  return (
    <RetryButton
      size="sm"
      variant="ghost"
      className="h-auto p-1 text-xs"
      {...props}
    />
  );
}

// Hook for managing retry state
export function useRetry(
  retryFn: () => Promise<void> | void,
  options: {
    maxRetries?: number;
    initialRetryCount?: number;
    onMaxRetriesReached?: () => void;
  } = {}
) {
  const {
    maxRetries = 3,
    initialRetryCount = 0,
    onMaxRetriesReached,
  } = options;

  const [retryCount, setRetryCount] = useState(initialRetryCount);
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);

  const retry = useCallback(async () => {
    if (retryCount >= maxRetries) {
      onMaxRetriesReached?.();
      return;
    }

    setIsRetrying(true);
    setLastError(null);

    try {
      await retryFn();
      setRetryCount(0); // Reset on success
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setLastError(err);
      setRetryCount(prev => prev + 1);
      throw err;
    } finally {
      setIsRetrying(false);
    }
  }, [retryFn, retryCount, maxRetries, onMaxRetriesReached]);

  const reset = useCallback(() => {
    setRetryCount(0);
    setLastError(null);
    setIsRetrying(false);
  }, []);

  const canRetry = retryCount < maxRetries && !isRetrying;
  const maxRetriesReached = retryCount >= maxRetries;

  return {
    retry,
    reset,
    retryCount,
    isRetrying,
    lastError,
    canRetry,
    maxRetriesReached,
  };
}