/**
 * Authentication state management with Zustand
 * Stores user info and access token in memory and cookies
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, RegisterData, AuthResponse } from '@/lib/types';
import { authClient } from '@/lib/api/auth-client';
import { setAuthCookies, clearAuthCookies, broadcastAuthState, redirectToOriginalApp } from '@/lib/utils/auth-helpers';

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
        // Set tokens in cookies for cross-domain sharing
        setAuthCookies({
          accessToken,
          refreshToken: refreshToken || '',
          expiresIn: 3600, // 1 hour
        });
        
        set({
          user,
          accessToken,
          refreshToken: refreshToken || null,
          isAuthenticated: true,
          isLoading: false,
        });

        // Broadcast auth state to other domains
        broadcastAuthState({ user, isAuthenticated: true });
      },

      clearAuth: () => {
        // Clear cookies
        clearAuthCookies();
        
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
          const response = await authClient.login({ email, password });
          
          get().setAuth(
            response.user,
            response.tokens.accessToken,
            response.tokens.refreshToken
          );
          
          return response;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true });
          const response = await authClient.register(userData);
          
          get().setAuth(
            response.user,
            response.tokens.accessToken,
            response.tokens.refreshToken
          );
          
          return response;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginAndRedirect: async (email: string, password: string, returnUrl?: string) => {
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

      registerAndRedirect: async (userData: RegisterData, returnUrl?: string) => {
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
          console.error('Logout error:', error);
        } finally {
          get().clearAuth();
        }
      },

      refreshAuthToken: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          
          const response = await authClient.refreshToken(refreshToken);
          
          get().setAuth(
            response.user,
            response.tokens.accessToken,
            response.tokens.refreshToken
          );
          
          return response;
        } catch (error) {
          get().clearAuth();
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
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

// Listen for storage events to sync auth state across tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'auth-storage' && e.newValue) {
      const authData = JSON.parse(e.newValue);
      useAuthStore.setState({
        user: authData.state.user,
        accessToken: authData.state.accessToken,
        refreshToken: authData.state.refreshToken,
        isAuthenticated: authData.state.isAuthenticated,
      });
    }
  });

  // Listen for auth:logout events to log out from all tabs
  window.addEventListener('auth:logout', () => {
    useAuthStore.getState().clearAuth();
  });
}

// Initialize auth state from cookies
if (typeof window !== 'undefined') {
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  const accessToken = getCookie('access_token');
  const refreshToken = getCookie('refresh_token');

  if (accessToken) {
    // Set auth state from cookies
    useAuthStore.setState({
      accessToken,
      refreshToken: refreshToken || null,
      isAuthenticated: true,
      isLoading: false,
    });

    // Verify token with backend
    authClient.getCurrentUser(accessToken)
      .then((user) => {
        useAuthStore.setState({ user });
      })
      .catch(() => {
        // Token is invalid, clear auth state
        useAuthStore.getState().clearAuth();
      });
  } else {
    // No token, set loading to false
    useAuthStore.setState({ isLoading: false });
  }
}