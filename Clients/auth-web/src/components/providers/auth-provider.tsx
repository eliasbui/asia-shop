'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/state/auth-store';
import { LoadingSpinner } from '@/components/common/loading-spinner';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider component that handles authentication initialization
 * and prevents UI flicker during authentication state changes
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading, isAuthenticated } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Mark as initialized after a short delay to allow for initial auth state to be determined
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner while auth state is being initialized or loading
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" className="mx-auto text-primary" />
          <p className="text-muted-foreground animate-pulse">
            {isLoading ? 'Authenticating...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // Children are only rendered after auth state is fully determined
  return <>{children}</>;
}