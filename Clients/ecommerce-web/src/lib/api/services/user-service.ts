import { z } from "zod";
import { User, AuthResponse, UserSchema, AuthResponseSchema } from "@/types/models";

const USER_API_URL = process.env.NEXT_PUBLIC_USER_API_URL || "https://localhost:7031";

// .NET API Response wrapper
const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    succeeded: z.boolean(),
    message: z.string().optional(),
    errors: z.array(z.string()).optional(),
    data: dataSchema.optional(),
  });

// Login request schema
const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean().optional(),
});

// Register request schema
const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
  name: z.string(),
  phone: z.string().optional(),
});

// MFA schemas
const MfaSetupResponseSchema = z.object({
  qrCodeUri: z.string(),
  manualEntryKey: z.string(),
});

const MfaVerifyRequestSchema = z.object({
  code: z.string().length(6),
  trustDevice: z.boolean().optional(),
});

export class UserService {
  private static async fetchFromAPI<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    // For development, bypass SSL certificate issues
    const isDevMode = process.env.NODE_ENV === "development";
    
    const response = await fetch(`${USER_API_URL}/api${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      // In production, ensure proper SSL handling
      ...(isDevMode && { 
        // Note: fetch doesn't support rejectUnauthorized directly
        // This would need to be configured at the system/proxy level
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  }

  private static setAuthToken(token: string) {
    // Store in memory only (as per requirements)
    // The auth store handles this
    return token;
  }

  static async login(email: string, password: string, rememberMe?: boolean): Promise<AuthResponse> {
    const response = await this.fetchFromAPI<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        rememberMe,
      }),
    });

    const result = ApiResponseSchema(
      z.object({
        accessToken: z.string(),
        refreshToken: z.string().optional(),
        expiresIn: z.number(),
        user: UserSchema,
        requiresTwoFactor: z.boolean().optional(),
      })
    ).parse(response);

    if (!result.succeeded || !result.data) {
      throw new Error(result.message || "Login failed");
    }

    // If 2FA is required, return partial response
    if (result.data.requiresTwoFactor) {
      return {
        accessToken: "", // Will be set after 2FA
        user: result.data.user,
      };
    }

    return {
      accessToken: result.data.accessToken,
      user: result.data.user,
    };
  }

  static async register(
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
    phone?: string
  ): Promise<AuthResponse> {
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const response = await this.fetchFromAPI<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        confirmPassword,
        name,
        phone,
      }),
    });

    const result = ApiResponseSchema(
      z.object({
        accessToken: z.string(),
        user: UserSchema,
      })
    ).parse(response);

    if (!result.succeeded || !result.data) {
      throw new Error(result.message || "Registration failed");
    }

    return {
      accessToken: result.data.accessToken,
      user: result.data.user,
    };
  }

  static async logout(accessToken: string): Promise<void> {
    await this.fetchFromAPI("/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await this.fetchFromAPI<any>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    const result = ApiResponseSchema(
      z.object({
        accessToken: z.string(),
        expiresIn: z.number(),
      })
    ).parse(response);

    if (!result.succeeded || !result.data) {
      throw new Error("Token refresh failed");
    }

    return { accessToken: result.data.accessToken };
  }

  // MFA Methods
  static async setupMfa(accessToken: string): Promise<{ qrCodeUri: string; manualKey: string }> {
    const response = await this.fetchFromAPI<any>("/mfa/setup", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const result = ApiResponseSchema(MfaSetupResponseSchema).parse(response);

    if (!result.succeeded || !result.data) {
      throw new Error(result.message || "MFA setup failed");
    }

    return {
      qrCodeUri: result.data.qrCodeUri,
      manualKey: result.data.manualEntryKey,
    };
  }

  static async verifyMfa(
    code: string,
    trustDevice?: boolean,
    tempToken?: string
  ): Promise<{ accessToken: string }> {
    const response = await this.fetchFromAPI<any>("/mfa/verify", {
      method: "POST",
      headers: tempToken ? {
        Authorization: `Bearer ${tempToken}`,
      } : undefined,
      body: JSON.stringify({
        code,
        trustDevice,
      }),
    });

    const result = ApiResponseSchema(
      z.object({
        accessToken: z.string(),
        expiresIn: z.number(),
      })
    ).parse(response);

    if (!result.succeeded || !result.data) {
      throw new Error(result.message || "MFA verification failed");
    }

    return { accessToken: result.data.accessToken };
  }

  static async disableMfa(accessToken: string, code: string): Promise<void> {
    const response = await this.fetchFromAPI<any>("/mfa/disable", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ code }),
    });

    const result = ApiResponseSchema(z.object({})).parse(response);

    if (!result.succeeded) {
      throw new Error(result.message || "Failed to disable MFA");
    }
  }

  // User Profile
  static async getCurrentUser(accessToken: string): Promise<User> {
    const response = await this.fetchFromAPI<any>("/user/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const result = ApiResponseSchema(UserSchema).parse(response);

    if (!result.succeeded || !result.data) {
      throw new Error(result.message || "Failed to get user profile");
    }

    return result.data;
  }

  static async updateProfile(
    accessToken: string,
    updates: Partial<Pick<User, "name" | "phone" | "avatar">>
  ): Promise<User> {
    const response = await this.fetchFromAPI<any>("/user/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updates),
    });

    const result = ApiResponseSchema(UserSchema).parse(response);

    if (!result.succeeded || !result.data) {
      throw new Error(result.message || "Failed to update profile");
    }

    return result.data;
  }

  static async changePassword(
    accessToken: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const response = await this.fetchFromAPI<any>("/user/change-password", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    });

    const result = ApiResponseSchema(z.object({})).parse(response);

    if (!result.succeeded) {
      throw new Error(result.message || "Failed to change password");
    }
  }

  // OTP for phone verification
  static async sendOtp(phoneOrEmail: string): Promise<void> {
    const response = await this.fetchFromAPI<any>("/auth/otp/send", {
      method: "POST",
      body: JSON.stringify({
        destination: phoneOrEmail,
      }),
    });

    const result = ApiResponseSchema(z.object({})).parse(response);

    if (!result.succeeded) {
      throw new Error(result.message || "Failed to send OTP");
    }
  }

  static async verifyOtp(
    phoneOrEmail: string,
    code: string
  ): Promise<{ verified: boolean }> {
    const response = await this.fetchFromAPI<any>("/auth/otp/verify", {
      method: "POST",
      body: JSON.stringify({
        destination: phoneOrEmail,
        code,
      }),
    });

    const result = ApiResponseSchema(
      z.object({
        verified: z.boolean(),
      })
    ).parse(response);

    if (!result.succeeded || !result.data) {
      throw new Error(result.message || "OTP verification failed");
    }

    return result.data;
  }

  // Password Reset
  static async forgotPassword(email: string): Promise<void> {
    const response = await this.fetchFromAPI<any>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    const result = ApiResponseSchema(z.object({})).parse(response);

    if (!result.succeeded) {
      throw new Error(result.message || "Failed to send reset email");
    }
  }

  static async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const response = await this.fetchFromAPI<any>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token,
        newPassword,
        confirmPassword,
      }),
    });

    const result = ApiResponseSchema(z.object({})).parse(response);

    if (!result.succeeded) {
      throw new Error(result.message || "Failed to reset password");
    }
  }
}
