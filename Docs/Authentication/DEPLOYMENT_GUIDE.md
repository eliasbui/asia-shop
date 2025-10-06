# Asia Shop Authentication System Deployment Guide

This guide provides step-by-step instructions for deploying and testing the Asia Shop authentication system.

## Overview

The Asia Shop authentication system consists of three main components:

1. **UserManagerServices** - Backend API for authentication
2. **auth-web** - Dedicated authentication frontend application
3. **auth-bridge** - JavaScript library for cross-domain authentication

## Prerequisites

- Node.js 20.0.0 or higher
- .NET 8.0 or higher
- Docker (optional)

## Deployment Steps

### 1. Deploy UserManagerServices

1. Navigate to the UserManagerServices directory:
   ```bash
   cd Server/Core/UserManagerServices
   ```

2. Configure the application settings:

   **appsettings.json**:
   ```json
   {
     "Jwt": {
       "SecretKey": "your-super-secret-key-with-at-least-32-characters",
       "Issuer": "asiashop",
       "Audience": "asiashop-users"
     },
     "ConnectionStrings": {
       "DefaultConnection": "your-connection-string"
     },
     "Cors": {
       "AllowedOrigins": [
         "http://localhost:3000",
         "http://localhost:3001",
         "http://localhost:3002",
         "https://shop.asiashop.com",
         "https://auth.asiashop.com",
         "https://admin.asiashop.com"
       ]
     }
   }
   ```

3. Run the application:
   ```bash
   dotnet run
   ```

4. Verify the API is running by accessing:
   ```
   http://localhost:5001/health
   ```

### 2. Deploy auth-web

1. Navigate to the auth-web directory:
   ```bash
   cd Clients/auth-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:

   **.env.local**:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api/v1/auth
   NEXT_PUBLIC_API_TIMEOUT=30000

   # Application Configuration
   NEXT_PUBLIC_APP_NAME="Asia Shop Authentication"
   NEXT_PUBLIC_APP_URL=http://localhost:3001

   # Cookie Configuration
   NEXT_PUBLIC_COOKIE_DOMAIN=localhost
   NEXT_PUBLIC_COOKIE_SECURE=false
   ```

4. Build and run the application:
   ```bash
   npm run build
   npm start
   ```

5. Verify the application is running by accessing:
   ```
   http://localhost:3001
   ```

### 3. Build auth-bridge Package

1. Navigate to the auth-bridge directory:
   ```bash
   cd Clients/auth-bridge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the package:
   ```bash
   npm run build
   ```

### 4. Integrate auth-bridge with ecommerce-web

1. Install the auth-bridge package:
   ```bash
   npm install ./Clients/auth-bridge
   ```

2. Create an authentication context in your application:

   **contexts/AuthContext.tsx**:
   ```typescript
   import React, { createContext, useContext, useEffect, useState } from 'react';
   import { getAuthBridge, AuthState } from '@asiashop/auth-bridge';

   interface AuthContextType {
     authState: AuthState | null;
     login: (returnUrl?: string) => void;
     logout: () => Promise<void>;
     register: (returnUrl?: string) => void;
   }

   const AuthContext = createContext<AuthContextType | undefined>(undefined);

   export const useAuth = () => {
     const context = useContext(AuthContext);
     if (!context) {
       throw new Error('useAuth must be used within an AuthProvider');
     }
     return context;
   };

   export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     const [authState, setAuthState] = useState<AuthState | null>(null);
     
     useEffect(() => {
       const authBridge = getAuthBridge({
         authWebUrl: process.env.NEXT_PUBLIC_AUTH_WEB_URL || 'http://localhost:3001',
         apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1/auth',
         cookieDomain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || 'localhost',
         cookieSecure: process.env.NODE_ENV === 'production',
       });
       
       // Get initial state
       setAuthState(authBridge.getState());
       
       // Subscribe to state changes
       const unsubscribe = authBridge.subscribe((state) => {
         setAuthState(state);
       });
       
       return unsubscribe;
     }, []);
     
     const login = (returnUrl?: string) => {
       const authBridge = getAuthBridge();
       authBridge.redirectToAuth(returnUrl);
     };
     
     const logout = async () => {
       const authBridge = getAuthBridge();
       await authBridge.logout();
     };
     
     const register = (returnUrl?: string) => {
       const authBridge = getAuthBridge();
       authBridge.redirectToRegister(returnUrl);
     };
     
     return (
       <AuthContext.Provider value={{ authState, login, logout, register }}>
         {children}
       </AuthContext.Provider>
     );
   };
   ```

3. Add the AuthProvider to your app:

   **pages/_app.tsx**:
   ```typescript
   import { AuthProvider } from '../contexts/AuthContext';

   function MyApp({ Component, pageProps }) {
     return (
       <AuthProvider>
         <Component {...pageProps} />
       </AuthProvider>
     );
   }

   export default MyApp;
   ```

4. Configure environment variables for ecommerce-web:

   **.env.local**:
   ```env
   NEXT_PUBLIC_AUTH_WEB_URL=http://localhost:3001
   NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1/auth
   NEXT_PUBLIC_COOKIE_DOMAIN=localhost
   ```

## Testing the Authentication Flow

### 1. Test User Registration

1. Navigate to the auth-web application:
   ```
   http://localhost:3001
   ```

2. Click on "Register" and fill out the registration form.

3. After successful registration, you should be redirected to the return URL or the home page.

4. Verify that the authentication cookies are set in your browser.

### 2. Test User Login

1. Navigate to the auth-web application:
   ```
   http://localhost:3001
   ```

2. Click on "Login" and enter your credentials.

3. After successful login, you should be redirected to the return URL or the home page.

4. Verify that the authentication cookies are set in your browser.

### 3. Test Cross-Domain Authentication

1. Open the ecommerce-web application in a new tab:
   ```
   http://localhost:3000
   ```

2. Since you're already logged in to auth-web, you should be automatically logged in to ecommerce-web.

3. Verify that the user information is displayed correctly.

### 4. Test Logout

1. In either application, click on the logout button.

2. Verify that you are logged out from all applications.

3. Verify that the authentication cookies are cleared.

### 5. Test Password Reset

1. Navigate to the login page:
   ```
   http://localhost:3001/auth/login
   ```

2. Click on "Forgot Password" and enter your email address.

3. Check your email for the password reset link.

4. Follow the link to reset your password.

5. Verify that you can log in with the new password.

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure that the frontend URLs are added to the `AllowedOrigins` list in the UserManagerServices configuration.

2. **Cookie Issues**
   - Verify that the `cookieDomain` is set correctly in both applications.
   - Ensure that `cookieSecure` is set to `false` for local development and `true` for production.

3. **Token Verification Errors**
   - Check that the JWT configuration is the same in all applications.
   - Verify that the JWT secret key is at least 32 characters long.

4. **Cross-Domain Communication Issues**
   - Ensure that the `allowedOrigins` list in the auth-bridge configuration includes all relevant domains.

### Debugging Tips

1. Check the browser console for JavaScript errors.

2. Use the browser's developer tools to inspect cookies and network requests.

3. Check the UserManagerServices logs for authentication errors.

4. Verify that the JWT tokens are being passed correctly in the Authorization header.

## Production Deployment

### 1. Environment Variables

For production deployment, ensure that the following environment variables are set:

**UserManagerServices**:
- `Jwt:SecretKey` - A secure secret key with at least 32 characters
- `ConnectionStrings:DefaultConnection` - Production database connection string

**auth-web**:
- `NEXT_PUBLIC_API_BASE_URL` - Production API URL
- `NEXT_PUBLIC_APP_URL` - Production auth-web URL
- `NEXT_PUBLIC_COOKIE_DOMAIN` - Production domain (e.g., `.asiashop.com`)
- `NEXT_PUBLIC_COOKIE_SECURE` - Set to `true` for production

**ecommerce-web**:
- `NEXT_PUBLIC_AUTH_WEB_URL` - Production auth-web URL
- `NEXT_PUBLIC_API_URL` - Production API URL
- `NEXT_PUBLIC_COOKIE_DOMAIN` - Production domain (e.g., `.asiashop.com`)

### 2. Security Considerations

1. Use HTTPS for all production applications.

2. Ensure that the JWT secret key is kept secure and not committed to version control.

3. Set appropriate cookie security options (Secure, HttpOnly, SameSite).

4. Implement rate limiting to prevent brute force attacks.

5. Use environment-specific configurations for development, staging, and production.

### 3. Monitoring and Logging

1. Set up monitoring for authentication failures and suspicious activities.

2. Implement comprehensive logging for authentication events.

3. Set up alerts for high authentication failure rates.

## Conclusion

This guide provides a comprehensive overview of deploying and testing the Asia Shop authentication system. By following these steps, you should be able to successfully deploy the authentication system and verify that it works correctly across all applications.