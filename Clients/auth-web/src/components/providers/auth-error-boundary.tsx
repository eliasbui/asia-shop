'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/button';

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface AuthErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/**
 * Error boundary component that catches authentication-related errors
 * and provides a graceful fallback UI
 */
export class AuthErrorBoundary extends React.Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[AuthErrorBoundary] Authentication error caught:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });

    // Log to external monitoring service in production
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error monitoring service
      console.warn('[AuthErrorBoundary] Would report to monitoring service');
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });

    // Clear potentially corrupted auth state
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-storage');
      sessionStorage.removeItem('auth_session_id');
      sessionStorage.removeItem('last_verified_token');

      // Force page reload to reset auth state
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="space-y-2">
              <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
              <h1 className="text-2xl font-bold text-foreground">
                Authentication Error
              </h1>
              <p className="text-muted-foreground">
                Something went wrong with the authentication system. Please try again.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-left">
                <p className="text-sm font-mono text-destructive">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={this.handleReset}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              <Button
                onClick={() => {
                  // Go to login page
                  if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                  }
                }}
                className="w-full"
                variant="outline"
              >
                Go to Login
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}