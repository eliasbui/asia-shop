import { z } from "zod";
import { api } from "@/lib/api/fetch-wrapper";

// Request/Response Schemas
const EnableMfaRequestSchema = z.object({
  totpCode: z.string().length(6),
});

const VerifyMfaRequestSchema = z.object({
  userId: z.string().uuid(),
  mfaCode: z.string(),
  mfaType: z.enum(["totp", "backup", "email"]),
});

const DisableMfaRequestSchema = z.object({
  currentPassword: z.string(),
  mfaCode: z.string(),
  reason: z.string().optional(),
});

const SendEmailOtpRequestSchema = z.object({
  userId: z.string().uuid(),
  purpose: z.string().optional(),
});

const RegenerateQrCodeRequestSchema = z.object({
  setupSessionId: z.string().uuid(),
});

const MfaSetupResponseSchema = z.object({
  qrCodeUri: z.string(),
  manualEntryKey: z.string(),
  setupSessionId: z.string().uuid(),
});

const MfaEnableResponseSchema = z.object({
  backupCodes: z.array(z.string()),
  recoveryCodesLeft: z.number(),
});

const MfaStatusResponseSchema = z.object({
  isEnabled: z.boolean(),
  isSetup: z.boolean(),
  mfaTypes: z.array(z.enum(["totp", "email", "backup"])),
  emailOtpEnabled: z.boolean(),
  backupCodesCount: z.number(),
  lastUsed: z.string().optional(),
  setupCompletedAt: z.string().optional(),
});

const BaseResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    succeeded: z.boolean(),
    message: z.string(),
    errors: z.array(z.string()).optional(),
    data: dataSchema.optional(),
  });

// Types
export interface EnableMfaRequest {
  totpCode: string;
}

export interface VerifyMfaRequest {
  userId: string;
  mfaCode: string;
  mfaType: "totp" | "backup" | "email";
}

export interface DisableMfaRequest {
  currentPassword: string;
  mfaCode: string;
  reason?: string;
}

export interface SendEmailOtpRequest {
  userId: string;
  purpose?: string;
}

export interface RegenerateQrCodeRequest {
  setupSessionId: string;
}

export interface MfaSetupResponse {
  qrCodeUri: string;
  manualEntryKey: string;
  setupSessionId: string;
}

export interface MfaEnableResponse {
  backupCodes: string[];
  recoveryCodesLeft: number;
}

export interface MfaStatusResponse {
  isEnabled: boolean;
  isSetup: boolean;
  mfaTypes: ("totp" | "email" | "backup")[];
  emailOtpEnabled: boolean;
  backupCodesCount: number;
  lastUsed?: string;
  setupCompletedAt?: string;
}

export type MfaType = "totp" | "backup" | "email";

export class MfaService {
  /**
   * Setup MFA - Generate TOTP secret and QR code
   */
  static async setupMfa(): Promise<MfaSetupResponse> {
    const response = await api.post<any>(
      "/api/v1/mfa/setup",
      {},
      {
        requiresAuth: true,
        schema: BaseResponseSchema(MfaSetupResponseSchema),
      }
    );
    return response.data!;
  }

  /**
   * Enable MFA - Complete setup with TOTP verification
   */
  static async enableMfa(request: EnableMfaRequest): Promise<MfaEnableResponse> {
    const response = await api.post<any>(
      "/api/v1/mfa/enable",
      request,
      {
        requiresAuth: true,
        schema: BaseResponseSchema(MfaEnableResponseSchema),
      }
    );
    return response.data!;
  }

  /**
   * Verify MFA code during authentication
   */
  static async verifyMfa(request: VerifyMfaRequest): Promise<{ success: boolean }> {
    const response = await api.post<any>(
      "/api/v1/mfa/verify",
      request,
      {
        schema: BaseResponseSchema(z.object({ success: z.boolean() })),
      }
    );
    return response.data!;
  }

  /**
   * Disable MFA
   */
  static async disableMfa(request: DisableMfaRequest): Promise<void> {
    await api.post(
      "/api/v1/mfa/disable",
      request,
      {
        requiresAuth: true,
      }
    );
  }

  /**
   * Generate new backup codes
   */
  static async generateBackupCodes(): Promise<string[]> {
    const response = await api.post<any>(
      "/api/v1/mfa/backup-codes/generate",
      {},
      {
        requiresAuth: true,
        schema: BaseResponseSchema(z.array(z.string())),
      }
    );
    return response.data!;
  }

  /**
   * Get MFA status
   */
  static async getMfaStatus(): Promise<MfaStatusResponse> {
    const response = await api.get<any>(
      "/api/v1/mfa/status",
      {
        requiresAuth: true,
        schema: BaseResponseSchema(MfaStatusResponseSchema),
      }
    );
    return response.data!;
  }

  /**
   * Send email OTP for MFA verification
   */
  static async sendEmailOtp(request: SendEmailOtpRequest): Promise<{ success: boolean }> {
    const response = await api.post<any>(
      "/api/v1/mfa/email-otp/send",
      request,
      {
        schema: BaseResponseSchema(z.object({ success: z.boolean() })),
      }
    );
    return response.data!;
  }

  /**
   * Generate QR code for MFA setup (first time)
   */
  static async generateQrCode(): Promise<MfaSetupResponse> {
    const response = await api.post<any>(
      "/api/v1/mfa/qr-code/generate",
      {},
      {
        requiresAuth: true,
        schema: BaseResponseSchema(MfaSetupResponseSchema),
      }
    );
    return response.data!;
  }

  /**
   * Regenerate QR code when expired
   */
  static async regenerateQrCode(request: RegenerateQrCodeRequest): Promise<MfaSetupResponse> {
    const response = await api.post<any>(
      "/api/v1/mfa/qr-code/regenerate",
      request,
      {
        requiresAuth: true,
        schema: BaseResponseSchema(MfaSetupResponseSchema),
      }
    );
    return response.data!;
  }
}