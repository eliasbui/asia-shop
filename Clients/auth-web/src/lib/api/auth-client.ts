/**
 * API client for authentication endpoints
 * Connects to UserManagerServices backend
 */
import type { 
  User, 
  RegisterData, 
  LoginCredentials, 
  AuthResponse, 
  ApiError,
  MfaSetupResponse,
  MfaEnableResponse,
  MfaStatusResponse,
  VerifyMfaRequest,
  SendEmailOtpRequest
} from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
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
   * Handle API errors from Server BaseResponse
   */
  private async handleError(response: Response): Promise<never> {
    let error: ApiError;

    try {
      const data = await response.json();
      // Server returns BaseResponse with success, message, errors
      error = {
        code: data.code || `ERROR_${response.status}`,
        message: data.message || response.statusText || "An error occurred",
        details: data.errors ? { errors: data.errors } : data.details,
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

      const result = await response.json();
      
      console.log('[AuthClient] API response:', {
        endpoint,
        hasResult: !!result,
        resultKeys: result ? Object.keys(result) : [],
        hasSuccess: result?.success !== undefined,
        hasIsSuccess: result?.isSuccess !== undefined,
        hasData: !!result?.data,
      });
      
      // Server returns BaseResponse with different formats
      // Format 1: { success: true, data: {...} }
      // Format 2: { isSuccess: true, data: {...} }
      if (result.success !== undefined || result.isSuccess !== undefined) {
        console.log('[AuthClient] Extracting data from BaseResponse wrapper');
        return result.data as T;
      }
      
      console.log('[AuthClient] Using result as-is (no BaseResponse wrapper)');
      return result as T;
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
   * Login with email/username and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Logout the current user
   */
  async logout(accessToken: string): Promise<void> {
    return this.request<void>('/api/v1/auth/logout', {
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
    return this.request<AuthResponse>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  /**
   * Initiate password reset
   */
  async forgotPassword(email: string, recaptchaToken?: string): Promise<void> {
    return this.request<void>('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email, recaptchaToken }),
    });
  }

  /**
   * Reset password with token - Server expects email, token, newPassword, confirmPassword
   */
  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
    confirmPassword: string,
    recaptchaToken?: string
  ): Promise<void> {
    return this.request<void>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        token, 
        newPassword, 
        confirmPassword,
        recaptchaToken
      }),
    });
  }

  /**
   * Change password - Server expects currentPassword, newPassword, confirmPassword
   */
  async changePassword(
    accessToken: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    return this.request<void>('/api/v1/auth/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ 
        currentPassword, 
        newPassword,
        confirmPassword 
      }),
    });
  }

  // ==================== MFA Methods ====================

  /**
   * Setup MFA - Generate QR code and secret
   */
  async setupMfa(accessToken: string): Promise<MfaSetupResponse> {
    return this.request<MfaSetupResponse>('/api/v1/mfa/setup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Enable MFA - Verify TOTP code and get backup codes
   */
  async enableMfa(accessToken: string, totpCode: string): Promise<MfaEnableResponse> {
    return this.request<MfaEnableResponse>('/api/v1/mfa/enable', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ totpCode }),
    });
  }

  /**
   * Verify MFA code during login
   */
  async verifyMfa(request: VerifyMfaRequest): Promise<boolean> {
    return this.request<boolean>('/api/v1/mfa/verify', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Disable MFA
   */
  async disableMfa(accessToken: string, password: string, mfaCode: string): Promise<boolean> {
    return this.request<boolean>('/api/v1/mfa/disable', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ password, mfaCode }),
    });
  }

  /**
   * Generate new backup codes
   */
  async generateBackupCodes(accessToken: string): Promise<string[]> {
    return this.request<string[]>('/api/v1/mfa/backup-codes/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Get MFA status
   */
  async getMfaStatus(accessToken: string): Promise<MfaStatusResponse> {
    return this.request<MfaStatusResponse>('/api/v1/mfa/status', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Send email OTP
   */
  async sendEmailOtp(request: SendEmailOtpRequest): Promise<boolean> {
    return this.request<boolean>('/api/v1/mfa/email-otp/send', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

// Export singleton instance
export const authClient = new AuthClient();

// Export class for testing
export { AuthClient };