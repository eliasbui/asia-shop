'use client';

import React from 'react';
import { AlertTriangle, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ApiError } from '@/lib/api/fetcher';

export interface ErrorBoxProps {
  error: Error | ApiError | null | undefined;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'default' | 'destructive' | 'network';
  title?: string;
  description?: string;
  className?: string;
  showRetry?: boolean;
  retryText?: string;
  isRetrying?: boolean;
}

// Error type detection utilities
function isNetworkError(error: Error): boolean {
  return (
    error.message.includes('Network Error') ||
    error.message.includes('Failed to fetch') ||
    error.message.includes('fetch') ||
    error.name === 'NetworkError' ||
    error.name === 'TypeError'
  );
}

function isApiError(error: Error): error is ApiError {
  return error instanceof Error && 'code' in error && 'status' in error;
}

function getErrorTitle(error: Error | null | undefined, variant: string): string {
  if (!error) return 'An error occurred';

  if (isNetworkError(error)) {
    return 'Connection Error';
  }

  if (isApiError(error)) {
    switch (error.status) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Authentication Required';
      case 403:
        return 'Access Denied';
      case 404:
        return 'Not Found';
      case 429:
        return 'Too Many Requests';
      case 500:
        return 'Server Error';
      case 502:
        return 'Service Unavailable';
      case 503:
        return 'Service Temporarily Unavailable';
      default:
        return 'API Error';
    }
  }

  switch (variant) {
    case 'network':
      return 'Network Error';
    case 'destructive':
      return 'Critical Error';
    default:
      return 'Error';
  }
}

function getErrorDescription(error: Error | null | undefined): string {
  if (!error) return 'Something went wrong. Please try again.';

  if (isNetworkError(error)) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  if (isApiError(error)) {
    // Use the API error message if available
    if (error.message && error.message !== 'An error occurred') {
      return error.message;
    }

    // Fallback messages based on status code
    switch (error.status) {
      case 400:
        return 'The request was invalid. Please check your input and try again.';
      case 401:
        return 'You need to be logged in to access this resource.';
      case 403:
        return 'You don\'t have permission to access this resource.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
      case 502:
      case 503:
        return 'The server is experiencing issues. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  return error.message || 'An unexpected error occurred. Please try again.';
}

function getErrorIcon(error: Error | null | undefined, variant: string) {
  if (!error) return AlertCircle;

  if (isNetworkError(error) || variant === 'network') {
    return WifiOff;
  }

  return AlertTriangle;
}

export function ErrorBox({
  error,
  onRetry,
  onDismiss,
  variant = 'default',
  title,
  description,
  className = '',
  showRetry = true,
  retryText = 'Try Again',
  isRetrying = false,
}: ErrorBoxProps) {
  if (!error) return null;

  const detectedVariant = isNetworkError(error) ? 'network' : variant;
  const errorTitle = title || getErrorTitle(error, detectedVariant);
  const errorDescription = description || getErrorDescription(error);
  const ErrorIcon = getErrorIcon(error, detectedVariant);

  const alertVariant = detectedVariant === 'destructive' ? 'destructive' : 'default';

  return (
    <Alert variant={alertVariant} className={`relative ${className}`}>
      <ErrorIcon className="h-4 w-4" />

      <div className="flex-1">
        <AlertTitle className="flex items-center justify-between">
          {errorTitle}
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 -mr-2 -mt-1"
              onClick={onDismiss}
            >
              ×
            </Button>
          )}
        </AlertTitle>

        <AlertDescription className="mt-2">
          <div className="space-y-3">
            <p className="text-sm">{errorDescription}</p>

            {showRetry && onRetry && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  disabled={isRetrying}
                  className="h-8"
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      {retryText}
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-medium opacity-70">
                  Error Details (Development)
                </summary>
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                    {error.name}: {error.message}
                  </p>
                  {error.stack && (
                    <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded mt-1">
                      {error.stack}
                    </pre>
                  )}
                  {isApiError(error) && (
                    <div className="text-xs space-y-1 mt-1">
                      <p><strong>Code:</strong> {error.code}</p>
                      <p><strong>Status:</strong> {error.status}</p>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </AlertDescription>
      </div>
    </Alert>
  );
}

// Specialized error components for different contexts
export function NetworkError(props: Omit<ErrorBoxProps, 'variant'>) {
  return <ErrorBox {...props} variant="network" />;
}

export function ApiErrorBox(props: Omit<ErrorBoxProps, 'variant'>) {
  return <ErrorBox {...props} variant="default" />;
}

export function CriticalError(props: Omit<ErrorBoxProps, 'variant'>) {
  return <ErrorBox {...props} variant="destructive" />;
}