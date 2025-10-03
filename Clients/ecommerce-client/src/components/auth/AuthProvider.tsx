"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/state/authStore';
import { useAuthToken } from '@/lib/state/authStore';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  token: string | null;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout: storeLogout,
    refreshToken: storeRefreshToken,
    setUser,
  } = useAuthStore();

  const token = useAuthToken();

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // If we have a token but no user data, try to validate the token
        if (token && !user) {
          await storeRefreshToken();
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Clear invalid token
        storeLogout();
      } finally {
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initializeAuth();
    }
  }, [token, user, storeRefreshToken, storeLogout, isInitialized]);

  // Enhanced logout function
  const logout = () => {
    storeLogout();
    // Clear any additional auth-related data
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('auth-storage');
  };

  // Enhanced refresh token function
  const refreshToken = async () => {
    try {
      await storeRefreshToken();
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading: isLoading || !isInitialized,
    user,
    token,
    login,
    register,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};