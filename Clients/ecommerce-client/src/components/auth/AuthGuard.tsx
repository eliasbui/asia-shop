"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/state/authStore';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/auth/login',
  fallback,
}) => {
  const router = useRouter();
  const { isAuthenticated, user, refreshToken, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoading) return;

      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // If authenticated, try to refresh token to ensure validity
      if (isAuthenticated && user) {
        try {
          await refreshToken();
        } catch (error) {
          // Token refresh failed, user needs to login again
          router.push(redirectTo);
          return;
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router, refreshToken, user]);

  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return fallback || null;
  }

  return <>{children}</>;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/auth/login',
}) => {
  return (
    <AuthGuard requireAuth={true} redirectTo={redirectTo}>
      {children}
    </AuthGuard>
  );
};

interface GuestRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({
  children,
  redirectTo = '/',
}) => {
  const { isAuthenticated } = useAuthStore();

  // If user is already authenticated, redirect away from auth pages
  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};