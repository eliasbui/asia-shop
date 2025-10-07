import { create } from "zustand";
import { User } from "@/types/models";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  
  login: (user, accessToken) => {
    set({
      user,
      accessToken,
      isAuthenticated: true,
    });
  },
  
  logout: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
    
    // Clear cart on logout (optional)
    // useCartStore.getState().clearCart();
  },
  
  updateUser: (updatedUser) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedUser } : null,
    }));
  },
  
  setAccessToken: (token) => {
    set({ accessToken: token });
  },
}));

// Helper functions for token management
export const getAccessToken = () => useAuthStore.getState().accessToken;
export const isAuthenticated = () => useAuthStore.getState().isAuthenticated;
