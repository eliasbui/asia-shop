/**
 * Authentication Bridge for Asia Shop Applications
 * Enables cross-domain authentication state sharing
 */
// Configuration with defaults
const DEFAULT_CONFIG = {
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
    constructor(config, options = {}) {
        this.listeners = new Set();
        this.messageHandler = null;
        this.config = Object.assign(Object.assign({}, DEFAULT_CONFIG), config);
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
    init() {
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
    loadStateFromCookies() {
        console.log('[AuthBridge] Loading auth state from cookies...');
        const { accessToken, refreshToken } = this.getAuthCookies();
        if (accessToken) {
            console.log('[AuthBridge] Access token found in cookies');
            this.state = Object.assign(Object.assign({}, this.state), { accessToken, refreshToken: refreshToken || null, isAuthenticated: true, isLoading: true });
            // Verify token with backend
            this.verifyToken(accessToken);
        }
        else {
            console.log('[AuthBridge] No access token found in cookies');
            this.state = Object.assign(Object.assign({}, this.state), { isAuthenticated: false, isLoading: false });
            this.notifyListeners();
        }
    }
    /**
     * Verify the access token with the backend
     */
    async verifyToken(accessToken) {
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
            }
            else {
                console.warn('[AuthBridge] Token verification failed with status:', response.status);
                // Token is invalid, clear auth state
                this.clearAuth();
            }
        }
        catch (error) {
            console.error('[AuthBridge] Token verification error:', error);
            // Clear auth state on error
            this.clearAuth();
            // Notify error handler if provided
            if (this.options.onError) {
                this.options.onError(error);
            }
        }
    }
    /**
     * Get authentication cookies
     */
    getAuthCookies() {
        if (typeof document === 'undefined')
            return { accessToken: null, refreshToken: null };
        const getCookie = (name) => {
            var _a;
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2)
                return ((_a = parts.pop()) === null || _a === void 0 ? void 0 : _a.split(';').shift()) || null;
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
    setupMessageListener() {
        if (typeof window === 'undefined')
            return;
        console.log('[AuthBridge] Setting up message listener...');
        this.messageHandler = (event) => {
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
            if (event.data &&
                event.data.type === 'auth-state-change' &&
                event.data.payload) {
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
    setupStorageListener() {
        if (typeof window === 'undefined')
            return;
        const storageHandler = (event) => {
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
                }
                catch (error) {
                    console.error('Failed to parse auth storage data:', error);
                }
            }
        };
        window.addEventListener('storage', storageHandler);
    }
    /**
     * Update the authentication state
     */
    updateState(updates) {
        this.state = Object.assign(Object.assign({}, this.state), updates);
        this.notifyListeners();
        // Call the onAuthStateChange callback if provided
        if (this.options.onAuthStateChange) {
            this.options.onAuthStateChange(Object.assign({}, this.state));
        }
    }
    /**
     * Notify all listeners of state changes
     */
    notifyListeners() {
        this.listeners.forEach(listener => listener(Object.assign({}, this.state)));
    }
    /**
     * Get the current authentication state
     */
    getState() {
        return Object.assign({}, this.state);
    }
    /**
     * Check if the user is authenticated
     */
    isAuthenticated() {
        return this.state.isAuthenticated;
    }
    /**
     * Get the current user
     */
    getUser() {
        return this.state.user;
    }
    /**
     * Get the access token
     */
    getAccessToken() {
        return this.state.accessToken;
    }
    /**
     * Redirect to the authentication service
     */
    redirectToAuth(returnUrl) {
        if (typeof window === 'undefined')
            return;
        const currentUrl = returnUrl || window.location.href;
        // Build redirect URL with return URL parameter
        const redirectUrl = `${this.config.authWebUrl}/auth/login?returnUrl=${encodeURIComponent(currentUrl)}`;
        // Redirect to authentication service
        window.location.href = redirectUrl;
    }
    /**
     * Redirect to the registration page
     */
    redirectToRegister(returnUrl) {
        if (typeof window === 'undefined')
            return;
        const currentUrl = returnUrl || window.location.href;
        // Build redirect URL with return URL parameter
        const redirectUrl = `${this.config.authWebUrl}/auth/register?returnUrl=${encodeURIComponent(currentUrl)}`;
        // Redirect to authentication service
        window.location.href = redirectUrl;
    }
    /**
     * Log out the current user
     */
    async logout() {
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
        }
        catch (error) {
            console.error('Logout API call failed:', error);
        }
        finally {
            // Always clear local state
            this.clearAuth();
        }
    }
    /**
     * Clear authentication state
     */
    clearAuth() {
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
    subscribe(listener) {
        this.listeners.add(listener);
        // Return unsubscribe function
        return () => {
            this.listeners.delete(listener);
        };
    }
    /**
     * Clean up resources
     */
    destroy() {
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
export function createAuthBridge(config, options) {
    return new AuthBridge(config, options);
}
/**
 * Singleton instance for easier usage
 */
let authBridgeInstance = null;
/**
 * Get or create the singleton authentication bridge instance
 */
export function getAuthBridge(config, options) {
    if (!authBridgeInstance) {
        if (!config) {
            throw new Error('Configuration is required for the first initialization');
        }
        authBridgeInstance = new AuthBridge(config, options);
    }
    return authBridgeInstance;
}
