import { z } from "zod";
import { api } from "@/lib/api/fetch-wrapper";

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7031";

// Request/Response Schemas
const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean().optional(),
});

const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
  name: z.string(),
  phone: z.string().optional(),
});

const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
  confirmPassword: z.string(),
});

const ForgotPasswordRequestSchema = z.object({
  email: z.string().email(),
});

const ResetPasswordRequestSchema = z.object({
  token: z.string(),
  newPassword: z.string(),
  confirmPassword: z.string(),
});

const RevokeTokenRequestSchema = z.object({
  userId: z.string().uuid().optional(),
  tokenId: z.string().uuid().optional(),
  allDevices: z.boolean().optional(),
});

// Response Schemas
const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  emailConfirmed: z.boolean(),
  phoneNumberConfirmed: z.boolean().optional(),
  twoFactorEnabled: z.boolean(),
  lockoutEnabled: z.boolean(),
  accessFailedCount: z.number(),
  roles: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
  user: UserSchema,
  requiresTwoFactor: z.boolean().optional(),
  message: z.string().optional(),
});

const BaseResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    succeeded: z.boolean(),
    message: z.string(),
    errors: z.array(z.string()).optional(),
    data: dataSchema.optional(),
  });

// Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RevokeTokenRequest {
  userId?: string;
  tokenId?: string;
  allDevices?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: any;
  requiresTwoFactor?: boolean;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  emailConfirmed: boolean;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled: boolean;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export class AuthService {
  /**
   * Login with email and password
   */
  static async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      "/api/v1/auth/login",
      request,
      {
        schema: LoginResponseSchema,
      }
    );
    return response;
  }

  /**
   * Register a new user
   */
  static async register(request: RegisterRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      "/api/v1/auth/register",
      request,
      {
        schema: LoginResponseSchema,
      }
    );
    return response;
  }

  /**
   * Logout current user
   */
  static async logout(): Promise<void> {
    await api.post(
      "/api/v1/auth/logout",
      {},
      {
        requiresAuth: true,
      }
    );
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(request: RefreshTokenRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      "/api/v1/auth/refresh",
      request,
      {
        schema: LoginResponseSchema,
      }
    );
    return response;
  }

  /**
   * Change password
   */
  static async changePassword(request: ChangePasswordRequest): Promise<void> {
    await api.post(
      "/api/v1/auth/change-password",
      request,
      {
        requiresAuth: true,
      }
    );
  }

  /**
   * Initiate password reset
   */
  static async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    await api.post(
      "/api/v1/auth/forgot-password",
      request
    );
  }

  /**
   * Reset password with token
   */
  static async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await api.post(
      "/api/v1/auth/reset-password",
      request
    );
  }

  /**
   * Revoke tokens
   */
  static async revokeToken(request: RevokeTokenRequest): Promise<void> {
    await api.post(
      "/api/v1/auth/revoke",
      request,
      {
        requiresAuth: true,
      }
    );
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(
      "/api/v1/users/profile",
      {
        requiresAuth: true,
        schema: UserSchema,
      }
    );
    return response;
  }
}