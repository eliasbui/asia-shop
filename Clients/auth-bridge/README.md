# Asia Shop Authentication Bridge

A lightweight JavaScript library that enables cross-domain authentication state sharing between Asia Shop applications.

## 🚀 Features

- **Cross-Domain Authentication**: Share authentication state across multiple domains
- **Cookie-Based Token Storage**: Securely store tokens in cookies with configurable options
- **PostMessage API Communication**: Communicate authentication state changes between domains
- **LocalStorage Sync**: Synchronize authentication state across tabs in the same domain
- **Token Verification**: Automatically verify tokens with the backend API
- **TypeScript Support**: Full TypeScript support with type definitions

## 📦 Installation

```bash
npm install @asiashop/auth-bridge
```

## 🛠️ Usage

### Basic Setup

```typescript
import { getAuthBridge } from '@asiashop/auth-bridge';

// Initialize the authentication bridge
const authBridge = getAuthBridge({
  authWebUrl: 'https://auth.asiashop.com',
  apiUrl: 'https://api.asiashop.com/api/v1/auth',
  cookieDomain: '.asiashop.com',
  cookieSecure: true,
  allowedOrigins: [
    'https://shop.asiashop.com',
    'https://admin.asiashop.com'
  ]
}, {
  onAuthStateChange: (state) => {
    console.log('Auth state changed:', state);
  },
  onError: (error) => {
    console.error('Auth error:', error);
  }
});
```

### Check Authentication Status

```typescript
// Check if user is authenticated
if (authBridge.isAuthenticated()) {
  // User is authenticated
  const user = authBridge.getUser();
  console.log('Current user:', user);
} else {
  // User is not authenticated, redirect to login
  authBridge.redirectToAuth();
}
```

### Get Access Token

```typescript
// Get the access token for API calls
const accessToken = authBridge.getAccessToken();
if (accessToken) {
  // Make authenticated API request
  const response = await fetch('https://api.asiashop.com/api/v1/protected', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
}
```

### Subscribe to Authentication State Changes

```typescript
// Subscribe to authentication state changes
const unsubscribe = authBridge.subscribe((state) => {
  if (state.isAuthenticated) {
    // User is logged in
    console.log('User logged in:', state.user);
  } else {
    // User is logged out
    console.log('User logged out');
  }
});

// Unsubscribe when no longer needed
unsubscribe();
```

### Login and Logout

```typescript
// Redirect to login page
authBridge.redirectToAuth('https://shop.asiashop.com/checkout');

// Redirect to registration page
authBridge.redirectToRegister('https://shop.asiashop.com/checkout');

// Logout the current user
await authBridge.logout();
```

## 🔧 Configuration Options

### AuthBridgeConfig

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `authWebUrl` | string | URL of the authentication service | Required |
| `apiUrl` | string | URL of the authentication API | Optional |
| `cookieDomain` | string | Domain for authentication cookies | `localhost` |
| `cookieSecure` | boolean | Whether cookies should be secure | `false` |
| `allowedOrigins` | string[] | List of allowed origins for cross-domain communication | `[]` |

### AuthBridgeOptions

| Option | Type | Description |
|--------|------|-------------|
| `onAuthStateChange` | function | Callback function called when authentication state changes |
| `onError` | function | Callback function called when an error occurs |

## 🏗️ Architecture

The Authentication Bridge uses the following mechanisms to share authentication state:

1. **Cookies**: Tokens are stored in cookies with a shared domain
2. **PostMessage API**: Authentication state changes are broadcast to other domains
3. **LocalStorage**: Authentication state is synchronized across tabs in the same domain
4. **Storage Events**: Changes to LocalStorage trigger state updates in other tabs

## 🌐 Cross-Domain Communication

The Authentication Bridge uses the PostMessage API to communicate authentication state changes between domains. When a user logs in or out on one domain, the authentication state is automatically updated on all other domains that are configured to receive these messages.

## 🔒 Security Considerations

- Tokens are stored in secure cookies with configurable options
- Cross-domain communication is restricted to allowed origins
- Token verification is performed with the backend API
- Automatic logout on token expiration or invalidation

## 📝 Example Implementation

```typescript
import { getAuthBridge } from '@asiashop/auth-bridge';
import { useEffect, useState } from 'react';

function useAuth() {
  const [authState, setAuthState] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Initialize the authentication bridge
    const authBridge = getAuthBridge({
      authWebUrl: process.env.NEXT_PUBLIC_AUTH_WEB_URL,
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      cookieDomain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
      cookieSecure: process.env.NODE_ENV === 'production',
    });
    
    // Subscribe to authentication state changes
    const unsubscribe = authBridge.subscribe((state) => {
      setAuthState(state);
      setLoading(false);
    });
    
    // Get initial state
    setAuthState(authBridge.getState());
    setLoading(false);
    
    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);
  
  const login = () => {
    authBridge.redirectToAuth(window.location.href);
  };
  
  const logout = async () => {
    await authBridge.logout();
  };
  
  return {
    authState,
    loading,
    login,
    logout,
  };
}

// Usage in a component
function Header() {
  const { authState, loading, login, logout } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <header>
      {authState?.isAuthenticated ? (
        <div>
          <span>Welcome, {authState.user?.firstName}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </header>
  );
}
```

## 📄 License

This package is licensed under the MIT License - see the LICENSE file for details.