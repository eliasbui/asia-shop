/**
 * Authentication state management with Zustand
 * Integrated with auth-bridge for cross-domain authentication
 */
import { create } from 'zustand';
import type { User } from '@/lib/types';
import { apiClient } from '@/lib/api/client';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, accessToken) => {
    apiClient.setAccessToken(accessToken);
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearAuth: () => {
    const state = get();
    // Only clear if we're not already in the process of loading
    if (!state.isLoading) {
      apiClient.setAccessToken(null);
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  setUser: (user) => {
    set({ user });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },
}));

// Listen for unauthorized events
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    useAuthStore.getState().clearAuth();
  });
}

