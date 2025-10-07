/**
 * Type definitions for authentication - matches UserManagerServices API
 */

export interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  emailConfirmed: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  userName?: string;
  dateOfBirth?: string;
  requestedRole?: string;
  autoConfirmEmail?: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface BaseResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// MFA Types
export type MfaType = 'TOTP' | 'BackupCode' | 'EmailOTP';

export interface MfaSetupResponse {
  secretKey: string;
  qrCodeUri: string;
  formattedSecretKey: string;
  instructions: string;
  isSuccess: boolean;
  nextStep: string;
  expiresAt?: string;
  setupSessionId?: string;
  expiresInSeconds?: number;
}

export interface MfaEnableResponse {
  isEnabled: boolean;
  backupCodes: string[];
  backupCodesCount: number;
  enabledAt: string;
  instructions: string[];
  warning: string;
}

export interface MfaStatusResponse {
  isEnabled: boolean;
  hasBackupCodes: boolean;
  remainingBackupCodes: number;
  totpEnabled: boolean;
  emailOtpEnabled: boolean;
  lastUsedAt?: string;
}

export interface VerifyMfaRequest {
  userId: string;
  mfaCode: string;
  mfaType: MfaType;
  sessionId?: string;
}

export interface SendEmailOtpRequest {
  userId: string;
  purpose?: string;
}
