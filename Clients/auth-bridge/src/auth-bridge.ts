/**
 * Authentication Bridge for Asia Shop Applications
 * Enables cross-domain authentication state sharing
 */

import type { AuthState, AuthBridgeConfig, AuthBridgeOptions, User } from './types';

// Configuration with defaults
const DEFAULT_CONFIG: Partial<AuthBridgeConfig> = {
  cookieDomain: 'localhost',
  cookieSecure: false,
  allowedOrigins: [],
};

// Token expiration times (in seconds)
const TOKEN_EXPIRY = {
  accessToken: 60 * 60, // 1 hour
  refreshToken: 60 * 60 * 24 * 7, // 7 days
};

/**
 * Authentication Bridge class
 */
export class AuthBridge {
  private config: AuthBridgeConfig;
  private options: AuthBridgeOptions;
  private state: AuthState;
  private listeners: Set<(state: AuthState) => void> = new Set();
  private messageHandler: ((event: MessageEvent) => void) | null = null;

  constructor(config: AuthBridgeConfig, options: AuthBridgeOptions = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config } as AuthBridgeConfig;
    this.options = options;
    
    // Initialize state
    this.state = {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      returnUrl: null,
    };

    // Initialize the bridge
    this.init();
  }

  /**
   * Initialize the authentication bridge
   */
  private init(): void {
    // Try to get auth state from cookies
    this.loadStateFromCookies();
    
    // Set up message listener for cross-domain communication
    this.setupMessageListener();
    
    // Set up storage event listener for same-domain communication
    this.setupStorageListener();
  }

  /**
   * Load authentication state from cookies
   */
  private loadStateFromCookies(): void {
    console.log('[AuthBridge] Loading auth state from cookies...');
    const { accessToken, refreshToken } = this.getAuthCookies();
    
    if (accessToken) {
      console.log('[AuthBridge] Access token found in cookies');
      this.state = {
        ...this.state,
        accessToken,
        refreshToken: refreshToken || null,
        isAuthenticated: true,
        isLoading: true,
      };
      
      // Verify token with backend
      this.verifyToken(accessToken);
    } else {
      console.log('[AuthBridge] No access token found in cookies');
      this.state = {
        ...this.state,
        isAuthenticated: false,
        isLoading: false,
      };
      this.notifyListeners();
    }
  }

  /**
   * Verify the access token with the backend
   */
  private async verifyToken(accessToken: string): Promise<void> {
    try {
      // Check if API URL is configured
      if (!this.config.apiUrl) {
        console.warn('[AuthBridge] API URL not configured, skipping token verification');
        this.state.isLoading = false;
        this.notifyListeners();
        return;
      }
      
      console.log('[AuthBridge] Verifying token with backend...');
      // Get current user from API
      const response = await fetch(`${this.config.apiUrl}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const user = await response.json();
        console.log('[AuthBridge] Token verification successful, user:', user.email);
        this.updateState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        console.warn('[AuthBridge] Token verification failed with status:', response.status);
        // Token is invalid, clear auth state
        this.clearAuth();
      }
    } catch (error) {
      console.error('[AuthBridge] Token verification error:', error);
      
      // Clear auth state on error
      this.clearAuth();
      
      // Notify error handler if provided
      if (this.options.onError) {
        this.options.onError(error as Error);
      }
    }
  }

  /**
   * Get authentication cookies
   */
  private getAuthCookies(): { accessToken: string | null; refreshToken: string | null } {
    if (typeof document === 'undefined') return { accessToken: null, refreshToken: null };

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
   * Set up message listener for cross-domain communication
   */
  private setupMessageListener(): void {
    if (typeof window === 'undefined') return;

    console.log('[AuthBridge] Setting up message listener...');

    this.messageHandler = (event: MessageEvent) => {
      // Only accept messages from allowed origins
      const allowedOrigins = [
        this.config.authWebUrl,
        window.location.origin,
        ...(this.config.allowedOrigins || []),
      ];
      
      // Log all auth-related messages for debugging
      if (event.data && event.data.type === 'auth-state-change') {
        console.log('[AuthBridge] Received auth state change message from:', event.origin);
        console.log('[AuthBridge] Message payload:', event.data.payload);
      }
      
      if (allowedOrigins.indexOf(event.origin) === -1) {
        console.warn('[AuthBridge] Rejected message from unauthorized origin:', event.origin);
        return;
      }

      // Check if this is an auth state change message
      if (
        event.data &&
        event.data.type === 'auth-state-change' &&
        event.data.payload
      ) {
        const { user, isAuthenticated } = event.data.payload;
        
        console.log('[AuthBridge] Updating auth state from message:', { isAuthenticated, hasUser: !!user });
        this.updateState({
          user,
          isAuthenticated,
          isLoading: false,
        });
      }
    };

    window.addEventListener('message', this.messageHandler);
    console.log('[AuthBridge] Message listener setup complete');
  }

  /**
   * Set up storage event listener for same-domain communication
   */
  private setupStorageListener(): void {
    if (typeof window === 'undefined') return;

    const storageHandler = (event: StorageEvent) => {
      // Only listen for auth-storage changes
      if (event.key === 'auth-storage' && event.newValue) {
        try {
          const authData = JSON.parse(event.newValue);
          const state = authData.state;
          
          this.updateState({
            user: state.user,
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
            isAuthenticated: state.isAuthenticated,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to parse auth storage data:', error);
        }
      }
    };

    window.addEventListener('storage', storageHandler);
  }

  /**
   * Update the authentication state
   */
  private updateState(updates: Partial<AuthState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
    
    // Call the onAuthStateChange callback if provided
    if (this.options.onAuthStateChange) {
      this.options.onAuthStateChange({ ...this.state });
    }
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  /**
   * Get the current authentication state
   */
  getState(): AuthState {
    return { ...this.state };
  }

  /**
   * Check if the user is authenticated
   */
  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  /**
   * Get the current user
   */
  getUser(): User | null {
    return this.state.user;
  }

  /**
   * Get the access token
   */
  getAccessToken(): string | null {
    return this.state.accessToken;
  }

  /**
   * Redirect to the authentication service
   */
  redirectToAuth(returnUrl?: string): void {
    if (typeof window === 'undefined') return;

    const currentUrl = returnUrl || window.location.href;

    // Build redirect URL with return URL parameter
    const redirectUrl = `${this.config.authWebUrl}/auth/login?returnUrl=${encodeURIComponent(currentUrl)}`;

    // Redirect to authentication service
    window.location.href = redirectUrl;
  }

  /**
   * Redirect to the registration page
   */
  redirectToRegister(returnUrl?: string): void {
    if (typeof window === 'undefined') return;

    const currentUrl = returnUrl || window.location.href;

    // Build redirect URL with return URL parameter
    const redirectUrl = `${this.config.authWebUrl}/auth/register?returnUrl=${encodeURIComponent(currentUrl)}`;

    // Redirect to authentication service
    window.location.href = redirectUrl;
  }

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    try {
      // Check if API URL is configured
      if (this.config.apiUrl && this.state.accessToken) {
        // Call logout API
        await fetch(`${this.config.apiUrl}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.state.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local state
      this.clearAuth();
    }
  }

  /**
   * Clear authentication state
   */
  clearAuth(): void {
    // Clear cookies
    if (typeof document !== 'undefined') {
      document.cookie = `access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${this.config.cookieDomain}; path=/; SameSite=lax`;
      document.cookie = `refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${this.config.cookieDomain}; path=/; SameSite=lax`;
    }
    
    // Clear state
    this.updateState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    // Broadcast logout event to other windows
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
  }

  /**
   * Subscribe to authentication state changes
   */
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    // Remove event listeners
    if (this.messageHandler && typeof window !== 'undefined') {
      window.removeEventListener('message', this.messageHandler);
      this.messageHandler = null;
    }
    
    // Clear all listeners
    this.listeners.clear();
  }
}

/**
 * Create a new authentication bridge instance
 */
export function createAuthBridge(config: AuthBridgeConfig, options?: AuthBridgeOptions): AuthBridge {
  return new AuthBridge(config, options);
}

/**
 * Singleton instance for easier usage
 */
let authBridgeInstance: AuthBridge | null = null;

/**
 * Get or create the singleton authentication bridge instance
 */
export function getAuthBridge(config?: AuthBridgeConfig, options?: AuthBridgeOptions): AuthBridge {
  if (!authBridgeInstance) {
    if (!config) {
      throw new Error('Configuration is required for the first initialization');
    }
    authBridgeInstance = new AuthBridge(config, options);
  }
  return authBridgeInstance;
}