/**
 * Session validation utilities for authentication
 * Provides functions to validate tokens and check session health
 */

interface TokenPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  iss?: string;
  aud?: string;
}

interface SessionValidationResult {
  isValid: boolean;
  isExpired: boolean;
  willExpireSoon: boolean;
  error?: string;
  timeUntilExpiry?: number;
}

/**
 * Parse JWT token without verification (for client-side validation only)
 */
export function parseJWT(token: string): TokenPayload | null {
  try {
    // Validate token format before parsing
    if (!token || typeof token !== 'string') {
      console.error('[SessionValidator] Invalid token: not a string');
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('[SessionValidator] Invalid token: must have 3 parts');
      return null;
    }

    const base64Url = parts[1];
    if (!base64Url) {
      console.error('[SessionValidator] Invalid token: missing payload');
      return null;
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('[SessionValidator] Failed to parse JWT:', error);
    return null;
  }
}

/**
 * Validate session token and check expiration
 */
export function validateSession(token: string): SessionValidationResult {
  try {
    if (!token) {
      return {
        isValid: false,
        isExpired: true,
        willExpireSoon: true,
        error: 'No token provided',
      };
    }

    const payload = parseJWT(token);
    if (!payload) {
      return {
        isValid: false,
        isExpired: true,
        willExpireSoon: true,
        error: 'Invalid token format',
      };
    }

    const now = Math.floor(Date.now() / 1000);
    const exp = payload.exp;

    if (!exp) {
      return {
        isValid: false,
        isExpired: true,
        willExpireSoon: true,
        error: 'Token has no expiration claim',
      };
    }

    const timeUntilExpiry = exp - now;
    const isExpired = timeUntilExpiry <= 0;
    const willExpireSoon = timeUntilExpiry <= 300; // 5 minutes

    console.log('[SessionValidator] Token validation:', {
      exp,
      now,
      timeUntilExpiry,
      isExpired,
      willExpireSoon,
    });

    return {
      isValid: !isExpired,
      isExpired,
      willExpireSoon,
      timeUntilExpiry,
    };
  } catch (error) {
    return {
      isValid: false,
      isExpired: true,
      willExpireSoon: true,
      error: error instanceof Error ? error.message : 'Unknown validation error',
    };
  }
}

/**
 * Check if session should be refreshed proactively
 */
export function shouldRefreshSession(token: string): boolean {
  if (!token) {
    return false;
  }
  const validation = validateSession(token);
  return validation.isValid && validation.willExpireSoon;
}

/**
 * Get time until token expires in milliseconds
 */
export function getTimeUntilExpiry(token: string): number {
  if (!token) {
    return 0;
  }
  const validation = validateSession(token);
  return validation.timeUntilExpiry ? validation.timeUntilExpiry * 1000 : 0;
}

/**
 * Check if token is valid for making API calls
 */
export function isTokenValidForApiCall(token: string): boolean {
  if (!token) {
    return false;
  }
  const validation = validateSession(token);
  return validation.isValid && !validation.willExpireSoon;
}

/**
 * Get debug information about the token
 */
export function getTokenDebugInfo(token: string): string {
  if (!token) {
    return 'No token provided';
  }
  const payload = parseJWT(token);
  if (!payload) {
    return 'Invalid token';
  }

  const validation = validateSession(token);
  const now = Math.floor(Date.now() / 1000);

  return JSON.stringify(
    {
      subject: payload.sub,
      issuedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : 'Unknown',
      expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'Unknown',
      currentTime: new Date(now * 1000).toISOString(),
      isValid: validation.isValid,
      isExpired: validation.isExpired,
      willExpireSoon: validation.willExpireSoon,
      timeUntilExpiry: validation.timeUntilExpiry
        ? `${Math.floor(validation.timeUntilExpiry / 60)}m ${validation.timeUntilExpiry % 60}s`
        : 'Unknown',
    },
    null,
    2
  );
}