"use client";

import { useCallback } from "react";
import { useAuthBridge } from "@/components/auth/auth-provider";
import { useAuthStore } from "@/lib/state";
import { authConfig } from "@/lib/auth/config";

export function useAuthActions() {
  const { authBridge } = useAuthBridge();
  const { isAuthenticated, user } = useAuthStore();

  const login = useCallback(
    (returnUrl?: string) => {
      if (authBridge) {
        authBridge.redirectToAuth(returnUrl);
      }
    },
    [authBridge]
  );

  const register = useCallback(
    (returnUrl?: string) => {
      if (authBridge) {
        authBridge.redirectToRegister(returnUrl);
      }
    },
    [authBridge]
  );

  const logout = useCallback(async () => {
    if (authBridge) {
      try {
        await authBridge.logout();
      } catch (error) {
        console.error("Logout failed:", error);
        // Even if logout API fails, clear local state
        authBridge.clearAuth();
      }
    }
  }, [authBridge]);

  const getAuthHeaders = useCallback(() => {
    const token = authBridge?.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [authBridge]);

  return {
    login,
    register,
    logout,
    isAuthenticated,
    user,
    getAuthHeaders,
    accessToken: authBridge?.getAccessToken() || null,
  };
}