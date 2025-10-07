/**
 * Authentication configuration for ecommerce-web
 */

export const authConfig = {
  // URL for the auth-web service
  authWebUrl: process.env.NEXT_PUBLIC_AUTH_WEB_URL || 'http://localhost:3000',
  
  // API URL for authentication endpoints
  apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  
  // Cookie domain for cross-domain authentication
  cookieDomain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || 'localhost',
  
  // Current application URL (for return URLs)
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  
  // Development mode
  isDev: process.env.NEXT_PUBLIC_DEV_MODE === 'true',
  
  // Cookie security settings
  cookieSecure: !process.env.NEXT_PUBLIC_DEV_MODE,
  
  // Allowed origins for cross-domain communication
  allowedOrigins: [
    process.env.NEXT_PUBLIC_AUTH_WEB_URL || 'http://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  ],
};

// Export individual configuration values for convenience
export const {
  authWebUrl,
  apiUrl,
  cookieDomain,
  appUrl,
  isDev,
  cookieSecure,
  allowedOrigins,
} = authConfig;