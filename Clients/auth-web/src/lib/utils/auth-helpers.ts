/**
 * Authentication utilities for cross-domain authentication
 * Provides helper functions for managing authentication state across domains
 */

import type { User } from '@/lib/types';

interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

// Cookie configuration
const COOKIE_CONFIG = {
  domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || 'localhost',
  secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true',
  sameSite: 'lax' as const,
  path: '/',
};

// Token expiration times (in seconds)
const TOKEN_EXPIRY = {
  accessToken: 60 * 60, // 1 hour
  refreshToken: 60 * 60 * 24 * 7, // 7 days
};

/**
 * Set authentication cookies
 */
export function setAuthCookies(tokens: AuthTokens): void {
  if (typeof window === 'undefined') return;

  // Set access token cookie
  document.cookie = `access_token=${tokens.accessToken}; max-age=${TOKEN_EXPIRY.accessToken}; domain=${COOKIE_CONFIG.domain}; path=${COOKIE_CONFIG.path}; SameSite=${COOKIE_CONFIG.sameSite}; ${COOKIE_CONFIG.secure ? 'Secure;' : ''}`;

  // Set refresh token cookie if available
  if (tokens.refreshToken) {
    document.cookie = `refresh_token=${tokens.refreshToken}; max-age=${TOKEN_EXPIRY.refreshToken}; domain=${COOKIE_CONFIG.domain}; path=${COOKIE_CONFIG.path}; SameSite=${COOKIE_CONFIG.sameSite}; ${COOKIE_CONFIG.secure ? 'Secure;' : ''}`;
  }
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies(): void {
  if (typeof window === 'undefined') return;

  // Clear access token cookie
  document.cookie = `access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${COOKIE_CONFIG.domain}; path=${COOKIE_CONFIG.path}; SameSite=${COOKIE_CONFIG.sameSite}; ${COOKIE_CONFIG.secure ? 'Secure;' : ''}`;

  // Clear refresh token cookie
  document.cookie = `refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${COOKIE_CONFIG.domain}; path=${COOKIE_CONFIG.path}; SameSite=${COOKIE_CONFIG.sameSite}; ${COOKIE_CONFIG.secure ? 'Secure;' : ''}`;
}

/**
 * Get authentication cookies
 */
export function getAuthCookies(): { accessToken: string | null; refreshToken: string | null } {
  if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  return {
    accessToken: getCookie('access_token'),
    refreshToken: getCookie('refresh_token'),
  };
}

/**
 * Send authentication state to other domains via postMessage
 */
export function broadcastAuthState(state: { user: User | null; isAuthenticated: boolean }, targetOrigin?: string): void {
  if (typeof window === 'undefined') return;

  console.log('[broadcastAuthState] Broadcasting auth state:', { 
    isAuthenticated: state.isAuthenticated,
    hasUser: !!state.user 
  });

  // Get all allowed origins
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_ECOMMERCE_WEB_URL,
    process.env.NEXT_PUBLIC_ADMIN_PANEL_URL,
    targetOrigin,
    '*', // Allow all origins for postMessage (the receiver will validate)
  ].filter(Boolean) as string[];

  const message = {
    type: 'auth-state-change',
    payload: {
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      timestamp: Date.now(),
    },
  };

  // Send message to parent window
  if (window.parent !== window) {
    allowedOrigins.forEach(origin => {
      try {
        window.parent.postMessage(message, origin);
        console.log('[broadcastAuthState] Sent to parent with origin:', origin);
      } catch (e) {
        console.warn('[broadcastAuthState] Failed to send to parent:', e);
      }
    });
  }

  // Send message to all child windows
  Array.from(window.frames).forEach(frame => {
    allowedOrigins.forEach(origin => {
      try {
        frame.postMessage(message, origin);
        console.log('[broadcastAuthState] Sent to frame with origin:', origin);
      } catch (e) {
        console.warn('[broadcastAuthState] Failed to send to frame:', e);
      }
    });
  });

  // Also dispatch a custom event for same-origin communication
  window.dispatchEvent(new CustomEvent('auth:state-change', { 
    detail: { 
      user: state.user, 
      isAuthenticated: state.isAuthenticated 
    } 
  }));
}

/**
 * Listen for authentication state changes from other domains
 */
export function listenForAuthStateChanges(callback: (state: { user: User | null; isAuthenticated: boolean }) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleMessage = (event: MessageEvent) => {
    // Only accept messages from our own origin or parent
    const allowedOrigins = [
      window.location.origin,
      process.env.NEXT_PUBLIC_ECOMMERCE_WEB_URL,
      process.env.NEXT_PUBLIC_ADMIN_PANEL_URL,
    ].filter(Boolean) as string[];

    if (
      !allowedOrigins.includes(event.origin) &&
      event.origin !== window.location.origin
    ) {
      return;
    }

    // Check if this is an auth state change message
    if (
      event.data &&
      event.data.type === 'auth-state-change' &&
      event.data.payload
    ) {
      callback({
        user: event.data.payload.user,
        isAuthenticated: event.data.payload.isAuthenticated,
      });
    }
  };

  window.addEventListener('message', handleMessage);

  // Return cleanup function
  return () => {
    window.removeEventListener('message', handleMessage);
  };
}

/**
 * Redirect to authentication service with return URL
 */
export function redirectToAuth(returnUrl?: string): void {
  if (typeof window === 'undefined') return;

  const authUrl = process.env.NEXT_PUBLIC_AUTH_WEB_URL || 'http://localhost:3001';
  const currentUrl = returnUrl || window.location.href;

  // Build redirect URL with return URL parameter
  const redirectUrl = `${authUrl}/auth/login?returnUrl=${encodeURIComponent(currentUrl)}`;

  // Redirect to authentication service
  window.location.href = redirectUrl;
}

/**
 * Redirect back to original application after authentication
 */
export function redirectToOriginalApp(returnUrl?: string): void {
  if (typeof window === 'undefined') return;

  const defaultReturnUrl = process.env.NEXT_PUBLIC_ECOMMERCE_WEB_URL || 'http://localhost:3000';
  const url = returnUrl || defaultReturnUrl;

  window.location.href = url;
}

/**
 * Check if current page is in an iframe
 */
export function isInIframe(): boolean {
  if (typeof window === 'undefined') return false;
  return window.parent !== window;
}

/**
 * Get authentication state from cookies
 */
export async function getAuthStateFromCookies(): Promise<{ user: User | null; isAuthenticated: boolean }> {
  if (typeof window === 'undefined') return { user: null, isAuthenticated: false };

  const { accessToken } = getAuthCookies();

  if (!accessToken) {
    return { user: null, isAuthenticated: false };
  }

  try {
    // Import authClient dynamically to avoid SSR issues
    const { authClient } = await import('@/lib/api/auth-client');
    const user = await authClient.getCurrentUser(accessToken);
    return { user, isAuthenticated: true };
  } catch (error) {
    console.error('Failed to get user from token:', error);
    return { user: null, isAuthenticated: false };
  }
}