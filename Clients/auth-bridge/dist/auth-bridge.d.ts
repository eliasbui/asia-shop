/**
 * Authentication Bridge for Asia Shop Applications
 * Enables cross-domain authentication state sharing
 */
import type { AuthState, AuthBridgeConfig, AuthBridgeOptions, User } from './types';
/**
 * Authentication Bridge class
 */
export declare class AuthBridge {
    private config;
    private options;
    private state;
    private listeners;
    private messageHandler;
    constructor(config: AuthBridgeConfig, options?: AuthBridgeOptions);
    /**
     * Initialize the authentication bridge
     */
    private init;
    /**
     * Load authentication state from cookies
     */
    private loadStateFromCookies;
    /**
     * Verify the access token with the backend
     */
    private verifyToken;
    /**
     * Get authentication cookies
     */
    private getAuthCookies;
    /**
     * Set up message listener for cross-domain communication
     */
    private setupMessageListener;
    /**
     * Set up storage event listener for same-domain communication
     */
    private setupStorageListener;
    /**
     * Update the authentication state
     */
    private updateState;
    /**
     * Notify all listeners of state changes
     */
    private notifyListeners;
    /**
     * Get the current authentication state
     */
    getState(): AuthState;
    /**
     * Check if the user is authenticated
     */
    isAuthenticated(): boolean;
    /**
     * Get the current user
     */
    getUser(): User | null;
    /**
     * Get the access token
     */
    getAccessToken(): string | null;
    /**
     * Redirect to the authentication service
     */
    redirectToAuth(returnUrl?: string): void;
    /**
     * Redirect to the registration page
     */
    redirectToRegister(returnUrl?: string): void;
    /**
     * Log out the current user
     */
    logout(): Promise<void>;
    /**
     * Clear authentication state
     */
    clearAuth(): void;
    /**
     * Subscribe to authentication state changes
     */
    subscribe(listener: (state: AuthState) => void): () => void;
    /**
     * Clean up resources
     */
    destroy(): void;
}
/**
 * Create a new authentication bridge instance
 */
export declare function createAuthBridge(config: AuthBridgeConfig, options?: AuthBridgeOptions): AuthBridge;
/**
 * Get or create the singleton authentication bridge instance
 */
export declare function getAuthBridge(config?: AuthBridgeConfig, options?: AuthBridgeOptions): AuthBridge;
