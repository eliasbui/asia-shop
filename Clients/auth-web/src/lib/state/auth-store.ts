/**
 * Authentication state management with Zustand
 * Stores user info and access token in memory and cookies
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, RegisterData, AuthResponse } from "@/lib/types";
import { authClient } from "@/lib/api/auth-client";
import {
  setAuthCookies,
  clearAuthCookies,
  broadcastAuthState,
  redirectToOriginalApp,
} from "@/lib/utils/auth-helpers";
import {
  validateSession,
  shouldRefreshSession,
} from "@/lib/utils/session-validator";

// Extend Window interface to include auth timer property
declare global {
  interface Window {
    __authRefreshTimer?: NodeJS.Timeout | null;
  }
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  returnUrl: string | null;
}

interface AuthActions {
  setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
  setReturnUrl: (url: string | null) => void;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<AuthResponse>;
  startTokenRefreshTimer: () => void;
  stopTokenRefreshTimer: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
      returnUrl: null,

      setAuth: (user, accessToken, refreshToken) => {
        console.log('[AuthStore] Setting auth state and cookies', {
          hasUser: !!user,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          userId: user?.id,
        });

        // Set tokens in cookies for cross-domain sharing
        setAuthCookies({
          accessToken,
          refreshToken: refreshToken || "",
          expiresIn: 3600, // 1 hour
        });

        console.log('[AuthStore] Cookies set successfully');

        const state = get();

        set({
          user,
          accessToken,
          refreshToken: refreshToken || null,
          isAuthenticated: true,
          isLoading: false,
        });

        // Start automatic token refresh timer
        if (refreshToken) {
          state.startTokenRefreshTimer();
        }

        // Broadcast auth state to other domains
        broadcastAuthState({ user, isAuthenticated: true });
      },

      clearAuth: () => {
        // Clear cookies
        clearAuthCookies();

        // Clear session verification markers
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("auth_session_id");
          sessionStorage.removeItem("last_verified_token");
        }

        // Stop token refresh timer
        get().stopTokenRefreshTimer();

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // Broadcast auth state to other domains
        broadcastAuthState({ user: null, isAuthenticated: false });
      },

      setUser: (user) => {
        set({ user });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setReturnUrl: (url) => {
        set({ returnUrl: url });
      },

      login: async (email, password) => {
        try {
          set({ isLoading: true });
          console.log('[AuthStore] Calling login API...');
          
          const response = await authClient.login({
            emailOrUsername: email,
            password,
            rememberMe: false,
          });

          console.log('[AuthStore] API response received:', {
            hasResponse: !!response,
            hasUser: !!response?.user,
            hasAccessToken: !!response?.accessToken,
            hasRefreshToken: !!response?.refreshToken,
            responseKeys: response ? Object.keys(response) : [],
          });

          if (!response || !response.user || !response.accessToken) {
            console.error('[AuthStore] Invalid API response structure:', response);
            throw new Error('Invalid response from authentication server');
          }

          get().setAuth(
            response.user,
            response.accessToken,
            response.refreshToken
          );

          return response;
        } catch (error) {
          console.error('[AuthStore] Login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true });
          const response = await authClient.register({
            ...userData,
            userName: userData.userName || userData.email.split("@")[0],
            autoConfirmEmail: false,
          });

          get().setAuth(
            response.user,
            response.accessToken,
            response.refreshToken
          );

          return response;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginAndRedirect: async (
        email: string,
        password: string,
        returnUrl?: string
      ) => {
        try {
          const response = await get().login(email, password);

          // Redirect to original app after successful login
          setTimeout(() => {
            redirectToOriginalApp(returnUrl);
          }, 500);

          return response;
        } catch (error) {
          throw error;
        }
      },

      registerAndRedirect: async (
        userData: RegisterData,
        returnUrl?: string
      ) => {
        try {
          const response = await get().register(userData);

          // Redirect to original app after successful registration
          setTimeout(() => {
            redirectToOriginalApp(returnUrl);
          }, 500);

          return response;
        } catch (error) {
          throw error;
        }
      },

      logout: async () => {
        try {
          const { accessToken } = get();
          if (accessToken) {
            await authClient.logout(accessToken);
          }
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          get().clearAuth();
        }
      },

      refreshAuthToken: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          console.log("[AuthStore] Refreshing access token...");
          const response = await authClient.refreshToken(refreshToken);

          get().setAuth(
            response.user,
            response.accessToken,
            response.refreshToken
          );

          // Restart the refresh timer with the new token
          get().startTokenRefreshTimer();

          console.log("[AuthStore] Token refresh successful");
          return response;
        } catch (error) {
          console.error("[AuthStore] Token refresh failed:", error);
          get().clearAuth();
          throw error;
        }
      },

      startTokenRefreshTimer: () => {
        // Clear any existing timer
        get().stopTokenRefreshTimer();

        const { refreshToken } = get();
        if (!refreshToken) {
          return;
        }

        console.log("[AuthStore] Starting automatic token refresh timer");

        // Schedule token refresh 5 minutes before expiry (assuming 1 hour expiry)
        const refreshInterval = 55 * 60 * 1000; // 55 minutes

        const timer: NodeJS.Timeout = setTimeout(async () => {
          console.log("[AuthStore] Automatic token refresh triggered");
          try {
            await get().refreshAuthToken();
          } catch (error) {
            console.error("[AuthStore] Automatic token refresh failed:", error);
          }
        }, refreshInterval);

        // Store timer ID globally for cleanup
        if (typeof window !== "undefined") {
          window.__authRefreshTimer = timer;
        }
      },

      stopTokenRefreshTimer: () => {
        if (typeof window !== "undefined") {
          const timer = window.__authRefreshTimer;
          if (timer) {
            clearTimeout(timer);
            window.__authRefreshTimer = null;
            console.log("[AuthStore] Token refresh timer stopped");
          }
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        returnUrl: state.returnUrl,
      }),
    }
  )
);

// Listen for storage events to sync auth state across tabs (with debouncing)
if (typeof window !== "undefined") {
  let storageTimeout: NodeJS.Timeout | null = null;

  window.addEventListener("storage", (e) => {
    if (e.key === "auth-storage" && e.newValue) {
      // Debounce storage events to prevent rapid state changes
      if (storageTimeout) {
        clearTimeout(storageTimeout);
      }

      storageTimeout = setTimeout(() => {
        try {
          if (!e.newValue) {
            return;
          }
          const authData = JSON.parse(e.newValue);
          const currentState = useAuthStore.getState();

          // Only update if the incoming data is different and more recent
          if (
            authData.state.isAuthenticated !== currentState.isAuthenticated ||
            authData.state.accessToken !== currentState.accessToken ||
            JSON.stringify(authData.state.user) !==
              JSON.stringify(currentState.user)
          ) {
            console.log("[AuthStore] Syncing auth state from storage event");

            // Stop current refresh timer before updating state
            currentState.stopTokenRefreshTimer();

            useAuthStore.setState({
              user: authData.state.user,
              accessToken: authData.state.accessToken,
              refreshToken: authData.state.refreshToken,
              isAuthenticated: authData.state.isAuthenticated,
            });

            // Restart refresh timer if authenticated
            if (authData.state.isAuthenticated && authData.state.refreshToken) {
              currentState.startTokenRefreshTimer();
            }
          }
        } catch (error) {
          console.error(
            "[AuthStore] Failed to parse storage event data:",
            error
          );
        }
      }, 100); // 100ms debounce
    }
  });

  // Listen for auth:logout events to log out from all tabs
  window.addEventListener("auth:logout", () => {
    console.log("[AuthStore] Received logout event, clearing auth state");
    useAuthStore.getState().clearAuth();
  });

  // Listen for auth:login events to refresh tokens
  window.addEventListener("auth:login", () => {
    console.log("[AuthStore] Received login event, refreshing auth state");
    const currentState = useAuthStore.getState();
    if (currentState.refreshToken) {
      currentState.refreshAuthToken();
    }
  });
}

// Initialize auth state from cookies
if (typeof window !== "undefined") {

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(";").shift();
      // Return null for empty, undefined, or whitespace-only values
      return cookieValue && cookieValue.trim() !== ""
        ? cookieValue.trim()
        : null;
    }
    return null;
  };

  // Check if we've already verified this session
  const sessionId = sessionStorage.getItem("auth_session_id");
  const currentAccessToken = getCookie("access_token");
  const lastVerifiedToken = sessionStorage.getItem("last_verified_token");

  // Only verify if this is a new session or token has changed
  const shouldVerify =
    !sessionId ||
    !lastVerifiedToken ||
    lastVerifiedToken !== currentAccessToken;

  // Debounce function to prevent multiple verification attempts
  let verificationTimeout: NodeJS.Timeout | null = null;
  let isVerifying = false;

  const verifyTokenWithDebounce = async (
    accessToken: string,
    maxRetries = 3
  ) => {
    if (!shouldVerify) {
      console.log(
        "[AuthStore] Token already verified in this session, skipping verification"
      );
      useAuthStore.setState({ isLoading: false });
      return;
    }

    if (isVerifying) {
      console.log(
        "[AuthStore] Token verification already in progress, skipping"
      );
      return;
    }

    if (verificationTimeout) {
      clearTimeout(verificationTimeout);
    }

    verificationTimeout = setTimeout(async () => {
      let retryCount = 0;

      const attemptVerification = async (): Promise<boolean> => {
        try {
          isVerifying = true;
          console.log(
            `[AuthStore] Verifying token (attempt ${
              retryCount + 1
            }/${maxRetries})`
          );

          // First, validate the token locally
          const tokenValidation = validateSession(accessToken);
          if (!tokenValidation.isValid) {
            console.log(
              "[AuthStore] Token is expired or invalid, clearing auth state"
            );
            useAuthStore.getState().clearAuth();
            return false;
          }

          // Check if token should be refreshed proactively
          if (shouldRefreshSession(accessToken)) {
            console.log(
              "[AuthStore] Token will expire soon, attempting refresh"
            );
            try {
              await useAuthStore.getState().refreshAuthToken();
              console.log("[AuthStore] Proactive token refresh successful");
            } catch (refreshError) {
              console.error(
                "[AuthStore] Proactive token refresh failed:",
                refreshError
              );
              // Continue with current token for now
            }
          }

      
          // Mark session as verified
          const newSessionId = `session_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
          sessionStorage.setItem("auth_session_id", newSessionId);
          sessionStorage.setItem("last_verified_token", accessToken);

          console.log(
            "[AuthStore] Token verification successful, session marked as verified"
          );
          return true;
        } catch (error) {
          console.error(
            `[AuthStore] Token verification failed (attempt ${
              retryCount + 1
            }):`,
            error
          );
          retryCount++;

          if (retryCount < maxRetries) {
            // Exponential backoff: 1s, 2s, 4s
            const backoffDelay = Math.pow(2, retryCount - 1) * 1000;
            console.log(`[AuthStore] Retrying in ${backoffDelay}ms`);
            await new Promise((resolve) => setTimeout(resolve, backoffDelay));
            return attemptVerification();
          } else {
            console.log("[AuthStore] Max retries reached, clearing auth state");
            // Clear session verification markers on failure
            sessionStorage.removeItem("auth_session_id");
            sessionStorage.removeItem("last_verified_token");
            useAuthStore.getState().clearAuth();
            return false;
          }
        } finally {
          isVerifying = false;
        }
      };

      await attemptVerification();
    }, 100); // 100ms debounce
  };

  const accessToken = getCookie("access_token");
  const refreshToken = getCookie("refresh_token");

  if (accessToken) {
   
    // Set initial auth state from cookies
    useAuthStore.setState({
      accessToken,
      refreshToken: refreshToken || null,
      isAuthenticated: true,
      isLoading: true, // Keep loading until verification is complete
    });

    // Verify token with backend (with debouncing and retry logic)
    verifyTokenWithDebounce(accessToken);

    // Start token refresh timer if refresh token is available
    if (refreshToken) {
      useAuthStore.getState().startTokenRefreshTimer();
    }
  } else {
   
    // No token, set loading to false
    useAuthStore.setState({ isLoading: false });
  }

}
