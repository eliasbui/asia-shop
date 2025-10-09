"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/state/auth-store";

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  accessToken: string | null;
}

const AUTH_WEB_URL = process.env.NEXT_PUBLIC_AUTH_WEB_URL || "http://localhost:3001";
const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || "localhost";

export function useAuthBridge() {
  const authStore = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize by checking cookies for existing auth
    const checkAuthFromCookie = () => {
      const cookies = document.cookie.split(";");
      const accessTokenCookie = cookies.find((c) =>
        c.trim().startsWith("accessToken=")
      );
      const userCookie = cookies.find((c) => c.trim().startsWith("user="));

      if (accessTokenCookie && userCookie) {
        const accessToken = accessTokenCookie.split("=")[1];
        const userJson = decodeURIComponent(userCookie.split("=")[1]);
        
        try {
          const user = JSON.parse(userJson);
          authStore.login(user, accessToken);
        } catch (e) {
          console.error("Failed to parse user from cookie", e);
        }
      }
      
      setIsReady(true);
    };

    checkAuthFromCookie();

    // Listen for storage events (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth-state" && e.newValue) {
        try {
          const authState = JSON.parse(e.newValue);
          if (authState.isAuthenticated) {
            authStore.login(authState.user, authState.accessToken);
          } else {
            authStore.logout();
          }
        } catch (err) {
          console.error("Failed to parse auth state from storage", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Listen for messages from auth-web
    const handleMessage = (event: MessageEvent) => {
      // Verify origin
      if (!event.origin.includes(AUTH_WEB_URL.replace(/https?:\/\//, ""))) {
        return;
      }

      if (event.data.type === "AUTH_STATE_CHANGED") {
        const { isAuthenticated, user, accessToken } = event.data.payload;
        
        if (isAuthenticated && user && accessToken) {
          authStore.login(user, accessToken);
          
          // Also sync to localStorage for cross-tab
          localStorage.setItem(
            "auth-state",
            JSON.stringify({ isAuthenticated, user, accessToken })
          );
        } else {
          authStore.logout();
          localStorage.removeItem("auth-state");
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("message", handleMessage);
    };
  }, [authStore]);

  const redirectToAuth = (returnUrl?: string) => {
    const url = returnUrl || window.location.href;
    const locale = window.location.pathname.split("/")[1] || "vi";
    window.location.href = `${AUTH_WEB_URL}/${locale}/auth/login?returnUrl=${encodeURIComponent(
      url
    )}`;
  };

  const redirectToRegister = (returnUrl?: string) => {
    const url = returnUrl || window.location.href;
    const locale = window.location.pathname.split("/")[1] || "vi";
    window.location.href = `${AUTH_WEB_URL}/${locale}/auth/register?returnUrl=${encodeURIComponent(
      url
    )}`;
  };

  const logout = async () => {
    // Clear cookies
    document.cookie = `accessToken=; domain=${COOKIE_DOMAIN}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `refreshToken=; domain=${COOKIE_DOMAIN}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `user=; domain=${COOKIE_DOMAIN}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    
    // Clear local storage
    localStorage.removeItem("auth-state");
    
    // Clear store
    authStore.logout();
    
    // Notify auth-web about logout
    const authWindow = window.open(
      `${AUTH_WEB_URL}/auth/logout`,
      "_blank",
      "width=1,height=1"
    );
    setTimeout(() => authWindow?.close(), 1000);
  };

  return {
    isReady,
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    accessToken: authStore.accessToken,
    redirectToAuth,
    redirectToRegister,
    logout,
  };
}
