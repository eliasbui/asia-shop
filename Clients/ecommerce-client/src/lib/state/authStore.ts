import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, AuthActions, User, AuthResponse, AuthError } from '@/lib/types/auth';

interface AuthStore extends AuthState, AuthActions {}

// In-memory token storage (not persisted)
const tokenStorage = {
  getValue: () => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('accessToken');
  },
  setValue: (value: string | null) => {
    if (typeof window === 'undefined') return;
    if (value) {
      sessionStorage.setItem('accessToken', value);
    } else {
      sessionStorage.removeItem('accessToken');
    }
  },
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 3) {
    return `${localPart[0]}***@${domain}`;
  }
  return `${localPart.slice(0, 3)}***@${domain}`;
};

const maskPhone = (phone: string): string => {
  if (phone.length <= 6) {
    return `${phone.slice(0, 2)}******`;
  }
  return `${phone.slice(0, 2)}******${phone.slice(-2)}`;
};

const createAuthError = (error: any): AuthError => {
  if (error.response?.data) {
    return {
      code: error.response.data.code || 'UNKNOWN_ERROR',
      message: error.response.data.message || 'An error occurred',
      details: error.response.data.details,
    };
  }
  return {
    code: 'NETWORK_ERROR',
    message: error.message || 'Network error occurred',
  };
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      requires2FA: false,
      tempToken: null,

      // Actions
      login: async (credentials, recaptchaToken) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(recaptchaToken && { 'X-Recaptcha-Token': recaptchaToken }),
            },
            body: JSON.stringify(credentials),
          });

          if (!response.ok) {
            throw new Error('Login failed');
          }

          const data: AuthResponse = await response.json();

          if (data.requires2FA) {
            set({
              requires2FA: true,
              tempToken: data.twoFactorToken || null,
              isLoading: false,
            });
            return;
          }

          const maskedUser = {
            ...data.user,
            maskedEmail: maskEmail(data.user.email),
            maskedPhone: data.user.phone ? maskPhone(data.user.phone) : undefined,
          };

          // Store access token in sessionStorage (not persisted)
          tokenStorage.setValue(data.accessToken);

          set({
            user: maskedUser,
            accessToken: data.accessToken,
            isAuthenticated: true,
            isLoading: false,
            requires2FA: false,
            tempToken: null,
          });
        } catch (error) {
          set({
            error: createAuthError(error),
            isLoading: false,
          });
        }
      },

      register: async (data, recaptchaToken) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(recaptchaToken && { 'X-Recaptcha-Token': recaptchaToken }),
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error('Registration failed');
          }

          const authData: AuthResponse = await response.json();

          const maskedUser = {
            ...authData.user,
            maskedEmail: maskEmail(authData.user.email),
            maskedPhone: authData.user.phone ? maskPhone(authData.user.phone) : undefined,
          };

          // Store access token in sessionStorage
          tokenStorage.setValue(authData.accessToken);

          set({
            user: maskedUser,
            accessToken: authData.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: createAuthError(error),
            isLoading: false,
          });
        }
      },

      loginWithGoogle: async (data, recaptchaToken) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(recaptchaToken && { 'X-Recaptcha-Token': recaptchaToken }),
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error('Google login failed');
          }

          const authData: AuthResponse = await response.json();

          const maskedUser = {
            ...authData.user,
            maskedEmail: maskEmail(authData.user.email),
            maskedPhone: authData.user.phone ? maskPhone(authData.user.phone) : undefined,
          };

          // Store access token in sessionStorage
          tokenStorage.setValue(authData.accessToken);

          set({
            user: maskedUser,
            accessToken: authData.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: createAuthError(error),
            isLoading: false,
          });
        }
      },

      verifyOTP: async (verification) => {
        set({ isLoading: true, error: null });

        try {
          const { tempToken } = get();
          const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(tempToken && { 'Authorization': `Bearer ${tempToken}` }),
            },
            body: JSON.stringify(verification),
          });

          if (!response.ok) {
            throw new Error('OTP verification failed');
          }

          const data: AuthResponse = await response.json();

          const maskedUser = {
            ...data.user,
            maskedEmail: maskEmail(data.user.email),
            maskedPhone: data.user.phone ? maskPhone(data.user.phone) : undefined,
          };

          // Store access token in sessionStorage
          tokenStorage.setValue(data.accessToken);

          set({
            user: maskedUser,
            accessToken: data.accessToken,
            isAuthenticated: true,
            isLoading: false,
            requires2FA: false,
            tempToken: null,
          });
        } catch (error) {
          set({
            error: createAuthError(error),
            isLoading: false,
          });
        }
      },

      resendOTP: async (request) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
          });

          if (!response.ok) {
            throw new Error('Failed to resend OTP');
          }

          set({ isLoading: false });
        } catch (error) {
          set({
            error: createAuthError(error),
            isLoading: false,
          });
        }
      },

      forgotPassword: async (data, recaptchaToken) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(recaptchaToken && { 'X-Recaptcha-Token': recaptchaToken }),
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error('Failed to send reset instructions');
          }

          set({ isLoading: false });
        } catch (error) {
          set({
            error: createAuthError(error),
            isLoading: false,
          });
        }
      },

      resetPassword: async (data) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error('Failed to reset password');
          }

          set({ isLoading: false });
        } catch (error) {
          set({
            error: createAuthError(error),
            isLoading: false,
          });
        }
      },

      logout: () => {
        // Clear token from sessionStorage
        tokenStorage.setValue(null);

        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
          requires2FA: false,
          tempToken: null,
        });
      },

      refreshToken: async () => {
        try {
          const { accessToken } = get();
          if (!accessToken) return;

          const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            get().logout();
            return;
          }

          const data = await response.json();

          // Store new access token in sessionStorage
          tokenStorage.setValue(data.accessToken);

          set({
            accessToken: data.accessToken,
          });
        } catch (error) {
          get().logout();
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist user data, not tokens
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        requires2FA: state.requires2FA,
      }),
      // On rehydrate, get token from sessionStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.accessToken = tokenStorage.getValue();
        }
      },
    }
  )
);

// Hook to get current token for API calls
export const useAuthToken = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  return accessToken || tokenStorage.getValue();
};