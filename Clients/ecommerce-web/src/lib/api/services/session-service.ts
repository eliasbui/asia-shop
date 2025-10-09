import { z } from "zod";
import { api } from "@/lib/api/fetch-wrapper";

// Request/Response Schemas
const UpdateSessionTimeoutRequestSchema = z.object({
  sessionTimeoutMinutes: z.number().min(5).max(1440),
  concurrentSessionLimit: z.number().min(1).max(10),
});

const SessionInfoSchema = z.object({
  sessionId: z.string().uuid(),
  device: z.string(),
  operatingSystem: z.string(),
  browser: z.string(),
  ipAddress: z.string(),
  location: z.string().optional(),
  createdAt: z.string(),
  lastActivity: z.string(),
  expiresAt: z.string(),
  isCurrent: z.boolean(),
  isActive: z.boolean(),
});

const SessionStatisticsSchema = z.object({
  totalSessions: z.number(),
  activeSessions: z.number(),
  expiredSessions: z.number(),
  terminatedSessions: z.number(),
  currentSessionTimeout: z.number(),
  maxConcurrentSessions: z.number(),
  averageSessionDuration: z.number(),
  lastLoginAt: z.string().optional(),
  devicesUsed: z.array(z.string()),
  locationsAccessed: z.array(z.string()),
});

const BaseResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    succeeded: z.boolean(),
    message: z.string(),
    errors: z.array(z.string()).optional(),
    data: dataSchema.optional(),
  });

// Types
export interface UpdateSessionTimeoutRequest {
  sessionTimeoutMinutes: number;
  concurrentSessionLimit: number;
}

export interface SessionInfo {
  sessionId: string;
  device: string;
  operatingSystem: string;
  browser: string;
  ipAddress: string;
  location?: string;
  createdAt: string;
  lastActivity: string;
  expiresAt: string;
  isCurrent: boolean;
  isActive: boolean;
}

export interface SessionStatistics {
  totalSessions: number;
  activeSessions: number;
  expiredSessions: number;
  terminatedSessions: number;
  currentSessionTimeout: number;
  maxConcurrentSessions: number;
  averageSessionDuration: number;
  lastLoginAt?: string;
  devicesUsed: string[];
  locationsAccessed: string[];
}

export class SessionService {
  /**
   * Terminate all other sessions except the current one
   */
  static async terminateAllOtherSessions(): Promise<{ terminatedCount: number }> {
    const response = await api.post<any>(
      "/api/v1/sessions/terminate-others",
      {},
      {
        requiresAuth: true,
        schema: BaseResponseSchema(z.object({ terminatedCount: z.number() })),
      }
    );
    return response.data!;
  }

  /**
   * Update session timeout settings
   */
  static async updateSessionTimeout(request: UpdateSessionTimeoutRequest): Promise<{ success: boolean }> {
    const response = await api.put<any>(
      "/api/v1/sessions/timeout",
      request,
      {
        requiresAuth: true,
        schema: BaseResponseSchema(z.object({ success: z.boolean() })),
      }
    );
    return response.data!;
  }

  /**
   * Get session statistics
   */
  static async getSessionStatistics(): Promise<SessionStatistics> {
    const response = await api.get<any>(
      "/api/v1/sessions/statistics",
      {
        requiresAuth: true,
        schema: BaseResponseSchema(SessionStatisticsSchema),
      }
    );
    return response.data!;
  }

  /**
   * Get all active sessions for the current user
   */
  static async getActiveSessions(): Promise<SessionInfo[]> {
    const response = await api.get<any>(
      "/api/v1/sessions/active",
      {
        requiresAuth: true,
        schema: BaseResponseSchema(z.array(SessionInfoSchema)),
      }
    );
    return response.data!;
  }

  /**
   * Terminate a specific session by ID
   */
  static async terminateSession(sessionId: string): Promise<{ success: boolean }> {
    const response = await api.post<any>(
      `/api/v1/sessions/${sessionId}/terminate`,
      {},
      {
        requiresAuth: true,
        schema: BaseResponseSchema(z.object({ success: z.boolean() })),
      }
    );
    return response.data!;
  }

  /**
   * Get current session information
   */
  static async getCurrentSession(): Promise<SessionInfo | null> {
    const sessions = await this.getActiveSessions();
    return sessions.find(session => session.isCurrent) || null;
  }

  /**
   * Check if session is about to expire (within 5 minutes)
   */
  static isSessionExpiringSoon(session: SessionInfo): boolean {
    const expiresAt = new Date(session.expiresAt);
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return expiresAt <= fiveMinutesFromNow;
  }

  /**
   * Get session duration in minutes
   */
  static getSessionDuration(session: SessionInfo): number {
    const createdAt = new Date(session.createdAt);
    const lastActivity = new Date(session.lastActivity);
    const diffMs = lastActivity.getTime() - createdAt.getTime();
    return Math.floor(diffMs / (1000 * 60));
  }

  /**
   * Get time remaining until session expires (in minutes)
   */
  static getSessionTimeRemaining(session: SessionInfo): number {
    const expiresAt = new Date(session.expiresAt);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
  }
}