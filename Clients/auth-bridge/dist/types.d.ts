/**
 * Types for authentication bridge
 */
export interface User {
    id: string;
    email: string;
    phone?: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    twoFactorEnabled: boolean;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
}
export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    returnUrl: string | null;
}
export interface AuthBridgeConfig {
    authWebUrl: string;
    apiUrl?: string;
    cookieDomain?: string;
    cookieSecure?: boolean;
    allowedOrigins?: string[];
}
export interface AuthBridgeOptions {
    onAuthStateChange?: (state: AuthState) => void;
    onError?: (error: Error) => void;
}
