"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import { createAuthBridge, type AuthBridge, type AuthState } from "@asiashop/auth-bridge";
import { authConfig } from "@/lib/auth/config";
import { useAuthStore } from "@/lib/state";

interface AuthContextType {
  authBridge: AuthBridge | null;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  authBridge: null,
  isLoading: true,
  error: null,
});

export function useAuthBridge() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authBridge, setAuthBridge] = useState<AuthBridge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const authStore = useAuthStore();

  useEffect(() => {
    // Initialize auth bridge only once
    try {
      console.log("[AuthProvider] Initializing auth bridge...");
      const bridge = createAuthBridge(
        {
          authWebUrl: authConfig.authWebUrl,
          apiUrl: authConfig.apiUrl,
          cookieDomain: authConfig.cookieDomain,
          cookieSecure: authConfig.cookieSecure,
          allowedOrigins: authConfig.allowedOrigins,
        },
        {
          onAuthStateChange: (state: AuthState) => {
            console.log("[AuthProvider] Auth state changed:", { 
              isAuthenticated: state.isAuthenticated, 
              hasUser: !!state.user,
              hasToken: !!state.accessToken 
            });
            // Update Zustand store with auth state changes
            if (state.isAuthenticated && state.user && state.accessToken) {
              authStore.setAuth(state.user, state.accessToken);
            } else {
              authStore.clearAuth();
            }
            authStore.setLoading(state.isLoading);
          },
          onError: (err: Error) => {
            console.error("Auth bridge error:", err);
            setError(err);
          },
        }
      );

      setAuthBridge(bridge);
      setIsLoading(false);
      console.log("[AuthProvider] Auth bridge initialized successfully");
    } catch (err) {
      console.error("Failed to initialize auth bridge:", err);
      setError(err as Error);
      setIsLoading(false);
    }

    // Cleanup on unmount
    return () => {
      console.log("[AuthProvider] Cleaning up auth bridge");
      if (authBridge) {
        authBridge.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only initialize once on mount

  const value: AuthContextType = {
    authBridge,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}