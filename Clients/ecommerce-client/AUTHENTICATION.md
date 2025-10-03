# Authentication System

This document provides a comprehensive overview of the authentication system implemented for the AsiaShop e-commerce client.

## Overview

The authentication system is built with security and user experience in mind, featuring:

- **Email/Phone + Password Login**: Traditional authentication method
- **Google OAuth Integration**: Social login option
- **Two-Factor Authentication (2FA)**: Enhanced security with OTP verification
- **Bearer Token Management**: Secure access token handling (in-memory only)
- **Google reCAPTCHA v3**: Bot protection
- **Data Masking**: Sensitive information protection (ph***@mail.com, 09******45)
- **Session Management**: Secure user session handling

## Architecture

### Core Components

#### 1. Authentication Store (`/src/lib/state/authStore.ts`)
- Zustand-based state management
- In-memory token storage with sessionStorage fallback
- Automatic token refresh
- User data masking
- Comprehensive error handling

#### 2. Authentication Types (`/src/lib/types/auth.ts`)
- Complete TypeScript interfaces
- Type-safe API responses
- Form validation schemas
- Security configuration types

#### 3. Authentication Utilities (`/src/lib/utils/auth.ts`)
- Form validation functions
- Password strength validation
- Email/phone masking utilities
- reCAPTCHA integration helpers
- Input sanitization

#### 4. Authentication Components

##### Login System
- **LoginForm** (`/src/components/auth/LoginForm.tsx`)
  - Email/phone input with validation
  - Password visibility toggle
  - Remember me functionality
  - Google OAuth integration
  - reCAPTCHA protection

##### Registration System
- **RegisterForm** (`/src/components/auth/RegisterForm.tsx`)
  - Comprehensive form validation
  - Password strength indicator
  - Real-time requirements feedback
  - Phone number formatting
  - Terms agreement checkbox

##### Password Recovery
- **ForgotPasswordForm** (`/src/components/auth/ForgotPasswordForm.tsx`)
  - Email/phone recovery options
  - Success state handling
  - Resend functionality
  - Security tips display

##### Two-Factor Authentication
- **OTPVerification** (`/src/components/auth/OTPVerification.tsx`)
  - 6-digit code input
  - Auto-focus management
  - Paste functionality
  - Resend countdown timer
  - Input validation

#### 5. Authentication Pages
- **Login Page** (`/src/app/auth/login/page.tsx`)
- **Register Page** (`/src/app/auth/register/page.tsx`)
- **Forgot Password Page** (`/src/app/auth/forgot-password/page.tsx`)
- **2FA Verification Page** (`/src/app/auth/2fa/page.tsx`)

#### 6. Route Protection
- **AuthGuard** (`/src/components/auth/AuthGuard.tsx`)
- **ProtectedRoute** wrapper
- **GuestRoute** wrapper
- Automatic token validation

## Security Features

### 1. Token Management
- **Access Tokens**: Stored in sessionStorage only (not persisted)
- **Automatic Refresh**: Token refresh before expiry
- **Invalidation**: Automatic logout on token failure
- **Secure Storage**: No localStorage usage for sensitive data

### 2. Data Protection
- **Email Masking**: `john.doe@example.com` → `joh***@example.com`
- **Phone Masking**: `+1234567890` → `+12******90`
- **Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&)

### 3. Bot Protection
- **Google reCAPTCHA v3** integration
- **Score-based validation**
- **Action-specific tokens**
- **Fallback handling**

### 4. Input Validation
- **Client-side validation** with real-time feedback
- **Server-side validation** support
- **SQL injection prevention**
- **XSS protection**

## API Integration

### Authentication Endpoints

```typescript
// Login
POST /api/auth/login
{
  emailOrPhone: string,
  password: string,
  rememberMe?: boolean
}

// Register
POST /api/auth/register
{
  email: string,
  phone?: string,
  password: string,
  confirmPassword: string,
  firstName: string,
  lastName: string,
  agreeToTerms: boolean
}

// Google OAuth
POST /api/auth/google
{
  token: string,
  rememberMe?: boolean
}

// OTP Verification
POST /api/auth/verify-otp
{
  emailOrPhone: string,
  code: string,
  token?: string
}

// Resend OTP
POST /api/auth/resend-otp
{
  emailOrPhone: string,
  purpose: 'login' | 'register' | 'forgot_password' | 'enable_2fa'
}

// Forgot Password
POST /api/auth/forgot-password
{
  emailOrPhone: string
}

// Reset Password
POST /api/auth/reset-password
{
  token: string,
  password: string,
  confirmPassword: string
}

// Refresh Token
POST /api/auth/refresh
```

### Response Format

```typescript
interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  requires2FA?: boolean;
  twoFactorToken?: string;
}
```

## Configuration

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Google reCAPTCHA Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key-here

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here

# App Configuration
NEXT_PUBLIC_APP_NAME=AsiaShop
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Security Configuration
NEXT_PUBLIC_SESSION_TIMEOUT=3600000  # 1 hour in milliseconds
```

## Usage Examples

### Basic Authentication

```typescript
import { useAuth } from '@/components/auth/AuthProvider';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        emailOrPhone: 'user@example.com',
        password: 'password123',
        rememberMe: true
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.maskedEmail}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Route Protection

```typescript
import { ProtectedRoute } from '@/components/auth/AuthGuard';

function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}

function GuestOnlyPage() {
  return (
    <GuestRoute>
      <div>This content is only visible to non-authenticated users</div>
    </GuestRoute>
  );
}
```

### Custom Authentication Forms

```typescript
import { LoginForm } from '@/components/auth/LoginForm';

function CustomLoginPage() {
  const handleSuccess = () => {
    // Handle successful login
    router.push('/dashboard');
  };

  return (
    <LoginForm
      onSuccess={handleSuccess}
      onForgotPassword={() => router.push('/forgot-password')}
      onGoogleLogin={() => router.push('/google-oauth')}
    />
  );
}
```

## Best Practices

### 1. Security
- Always validate input on both client and server
- Use HTTPS in production
- Implement rate limiting on API endpoints
- Log authentication attempts for security monitoring
- Regularly update dependencies

### 2. User Experience
- Provide clear error messages
- Show loading states during API calls
- Implement form validation with real-time feedback
- Use password strength indicators
- Offer multiple recovery options

### 3. Performance
- Implement proper loading states
- Use debouncing for validation
- Optimize reCAPTCHA loading
- Cache user data appropriately
- Implement lazy loading for auth components

### 4. Accessibility
- Use proper ARIA labels
- Implement keyboard navigation
- Provide screen reader support
- Use semantic HTML elements
- Ensure proper color contrast

## Troubleshooting

### Common Issues

1. **reCAPTCHA Not Working**
   - Ensure `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set
   - Check domain configuration in reCAPTCHA console
   - Verify script loading in browser console

2. **Google OAuth Issues**
   - Configure OAuth consent screen
   - Set correct redirect URIs
   - Enable required APIs in Google Cloud Console

3. **Token Refresh Failures**
   - Check network connectivity
   - Verify refresh token validity
   - Implement proper error handling

4. **2FA Not Working**
   - Ensure OTP service is configured
   - Check phone number/email format
   - Verify rate limiting settings

### Debug Mode

Enable debug mode by setting:

```env
NEXT_PUBLIC_DEBUG_AUTH=true
```

This will provide additional console logs for troubleshooting.

## Future Enhancements

1. **Biometric Authentication**: Fingerprint/Face ID support
2. **Social Login Options**: Facebook, Apple, GitHub integration
3. **Multi-factor Authentication**: SMS, Authenticator apps
4. **Device Management**: Trusted devices, session management
5. **Advanced Security**: Anomaly detection, risk-based authentication
6. **Analytics**: Authentication funnel analysis
7. **A/B Testing**: Different authentication flows

## Support

For authentication-related issues:
1. Check browser console for errors
2. Verify environment variables
3. Review API responses
4. Consult the troubleshooting section
5. Contact the development team

## License

This authentication system is part of the AsiaShop project and follows the same licensing terms.