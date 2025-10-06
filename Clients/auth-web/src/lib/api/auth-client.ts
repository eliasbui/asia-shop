/**
 * API client for authentication endpoints
 * Connects to UserManagerServices backend
 */
import type { 
  User, 
  RegisterData, 
  LoginCredentials, 
  AuthResponse, 
  ApiError 
} from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1/auth';
const API_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000;

class AuthClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Create abort controller with timeout
   */
  private createAbortController(): AbortController {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), this.timeout);
    return controller;
  }

  /**
   * Handle API errors
   */
  private async handleError(response: Response): Promise<never> {
    let error: ApiError;

    try {
      const data = await response.json();
      error = {
        code: data.code || "UNKNOWN_ERROR",
        message: data.message || response.statusText || "An error occurred",
        details: data.details,
      };
    } catch {
      error = {
        code: "NETWORK_ERROR",
        message: response.statusText || "Network error occurred",
      };
    }

    throw error;
  }

  /**
   * Make a request to the API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = this.createAbortController();

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        await this.handleError(response);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw {
            code: "TIMEOUT",
            message: "Request timeout",
          } as ApiError;
        }
      }
      throw error;
    }
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Logout the current user
   */
  async logout(accessToken: string): Promise<void> {
    return this.request<void>('/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(accessToken: string): Promise<User> {
    return this.request<User>('/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Initiate password reset
   */
  async forgotPassword(email: string): Promise<void> {
    return this.request<void>('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.request<void>('/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  /**
   * Change password
   */
  async changePassword(
    accessToken: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    return this.request<void>('/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }
}

// Export singleton instance
export const authClient = new AuthClient();

// Export class for testing
export { AuthClient };