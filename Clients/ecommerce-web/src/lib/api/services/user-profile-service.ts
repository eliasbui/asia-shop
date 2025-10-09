import { z } from "zod";
import { api } from "@/lib/api/fetch-wrapper";

// Request/Response Schemas
const UpdateUserProfileRequestSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
});

const UpdateUserPreferencesRequestSchema = z.object({
  language: z.string().optional(),
  timezone: z.string().optional(),
  theme: z.enum(["light", "dark", "auto"]).optional(),
  currency: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  twoFactorReminder: z.boolean().optional(),
});

const UpdateNotificationSettingsRequestSchema = z.object({
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  twoFactorReminder: z.boolean().optional(),
  loginAlerts: z.boolean().optional(),
  passwordChangeAlerts: z.boolean().optional(),
  purchaseConfirmations: z.boolean().optional(),
  shippingUpdates: z.boolean().optional(),
  promotionalOffers: z.boolean().optional(),
  newsletter: z.boolean().optional(),
});

const CreateApiKeyRequestSchema = z.object({
  name: z.string(),
  permissions: z.array(z.string()),
  expiresAt: z.string().optional(),
});

const UserProfileResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
  emailConfirmed: z.boolean(),
  phoneNumberConfirmed: z.boolean().optional(),
  twoFactorEnabled: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  lastLoginAt: z.string().optional(),
});

const UserPreferencesResponseSchema = z.object({
  userId: z.string().uuid(),
  language: z.string(),
  timezone: z.string(),
  theme: z.enum(["light", "dark", "auto"]),
  currency: z.string(),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  twoFactorReminder: z.boolean(),
  updatedAt: z.string(),
});

const NotificationSettingsResponseSchema = z.object({
  userId: z.string().uuid(),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  twoFactorReminder: z.boolean(),
  loginAlerts: z.boolean(),
  passwordChangeAlerts: z.boolean(),
  purchaseConfirmations: z.boolean(),
  shippingUpdates: z.boolean(),
  promotionalOffers: z.boolean(),
  newsletter: z.boolean(),
  updatedAt: z.string(),
});

const UserSessionsResponseSchema = z.object({
  userId: z.string().uuid(),
  sessions: z.array(z.object({
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
  })),
  totalSessions: z.number(),
  currentSessionId: z.string().uuid().optional(),
});

const ApiKeyResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  key: z.string(), // Only shown during creation
  permissions: z.array(z.string()),
  createdAt: z.string(),
  expiresAt: z.string().optional(),
  lastUsedAt: z.string().optional(),
  isActive: z.boolean(),
});

const UserApiKeysResponseSchema = z.object({
  userId: z.string().uuid(),
  keys: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    permissions: z.array(z.string()),
    createdAt: z.string(),
    expiresAt: z.string().optional(),
    lastUsedAt: z.string().optional(),
    isActive: z.boolean(),
  })),
  totalKeys: z.number(),
});

const UserActivityResponseSchema = z.object({
  userId: z.string().uuid(),
  activities: z.array(z.object({
    id: z.string().uuid(),
    action: z.string(),
    description: z.string(),
    ipAddress: z.string(),
    userAgent: z.string(),
    timestamp: z.string(),
    success: z.boolean(),
  })),
  pageNumber: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  totalRecords: z.number(),
});

const BaseResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    succeeded: z.boolean(),
    message: z.string(),
    errors: z.array(z.string()).optional(),
    data: dataSchema.optional(),
  });

// Types
export interface UpdateUserProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

export interface UpdateUserPreferencesRequest {
  language?: string;
  timezone?: string;
  theme?: "light" | "dark" | "auto";
  currency?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  marketingEmails?: boolean;
  twoFactorReminder?: boolean;
}

export interface UpdateNotificationSettingsRequest {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  marketingEmails?: boolean;
  twoFactorReminder?: boolean;
  loginAlerts?: boolean;
  passwordChangeAlerts?: boolean;
  purchaseConfirmations?: boolean;
  shippingUpdates?: boolean;
  promotionalOffers?: boolean;
  newsletter?: boolean;
}

export interface CreateApiKeyRequest {
  name: string;
  permissions: string[];
  expiresAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  emailConfirmed: boolean;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserPreferences {
  userId: string;
  language: string;
  timezone: string;
  theme: "light" | "dark" | "auto";
  currency: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  twoFactorReminder: boolean;
  updatedAt: string;
}

export interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  twoFactorReminder: boolean;
  loginAlerts: boolean;
  passwordChangeAlerts: boolean;
  purchaseConfirmations: boolean;
  shippingUpdates: boolean;
  promotionalOffers: boolean;
  newsletter: boolean;
  updatedAt: string;
}

export interface UserSession {
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

export interface UserSessions {
  userId: string;
  sessions: UserSession[];
  totalSessions: number;
  currentSessionId?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string; // Only shown during creation
  permissions: string[];
  createdAt: string;
  expiresAt?: string;
  lastUsedAt?: string;
  isActive: boolean;
}

export interface UserApiKeys {
  userId: string;
  keys: Omit<ApiKey, "key">[]; // Key is not shown in list
  totalKeys: number;
}

export interface UserActivity {
  userId: string;
  activities: Array<{
    id: string;
    action: string;
    description: string;
    ipAddress: string;
    userAgent: string;
    timestamp: string;
    success: boolean;
  }>;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export class UserProfileService {
  /**
   * Get user profile
   */
  static async getUserProfile(): Promise<UserProfile> {
    const response = await api.get<any>(
      "/api/v1/users/profile",
      {
        requiresAuth: true,
        schema: BaseResponseSchema(UserProfileResponseSchema),
      }
    );
    return response.data!;
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(request: UpdateUserProfileRequest): Promise<UserProfile> {
    const response = await api.put<any>(
      "/api/v1/users/profile",
      request,
      {
        requiresAuth: true,
        schema: BaseResponseSchema(UserProfileResponseSchema),
      }
    );
    return response.data!;
  }

  /**
   * Get user preferences
   */
  static async getUserPreferences(): Promise<UserPreferences> {
    const response = await api.get<any>(
      "/api/v1/users/preferences",
      {
        requiresAuth: true,
        schema: BaseResponseSchema(UserPreferencesResponseSchema),
      }
    );
    return response.data!;
  }

  /**
   * Update user preferences
   */
  static async updateUserPreferences(request: UpdateUserPreferencesRequest): Promise<UserPreferences> {
    const response = await api.put<any>(
      "/api/v1/users/preferences",
      request,
      {
        requiresAuth: true,
        schema: BaseResponseSchema(UserPreferencesResponseSchema),
      }
    );
    return response.data!;
  }

  /**
   * Get notification settings
   */
  static async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await api.get<any>(
      "/api/v1/users/notifications/settings",
      {
        requiresAuth: true,
        schema: BaseResponseSchema(NotificationSettingsResponseSchema),
      }
    );
    return response.data!;
  }

  /**
   * Update notification settings
   */
  static async updateNotificationSettings(request: UpdateNotificationSettingsRequest): Promise<NotificationSettings> {
    const response = await api.put<any>(
      "/api/v1/users/notifications/settings",
      request,
      {
        requiresAuth: true,
        schema: BaseResponseSchema(NotificationSettingsResponseSchema),
      }
    );
    return response.data!;
  }

  /**
   * Get user sessions
   */
  static async getUserSessions(): Promise<UserSessions> {
    const response = await api.get<any>(
      "/api/v1/users/sessions",
      {
        requiresAuth: true,
        schema: BaseResponseSchema(UserSessionsResponseSchema),
      }
    );
    return response.data!;
  }

  /**
   * Delete user session
   */
  static async deleteUserSession(sessionId: string): Promise<void> {
    await api.delete(
      `/api/v1/users/sessions/${sessionId}`,
      {
        requiresAuth: true,
      }
    );
  }

  /**
   * Get user API keys
   */
  static async getUserApiKeys(): Promise<UserApiKeys> {
    const response = await api.get<any>(
      "/api/v1/users/api-keys",
      {
        requiresAuth: true,
        schema: BaseResponseSchema(UserApiKeysResponseSchema),
      }
    );
    return response.data!;
  }

  /**
   * Create API key
   */
  static async createApiKey(request: CreateApiKeyRequest): Promise<ApiKey> {
    const response = await api.post<any>(
      "/api/v1/users/api-keys",
      request,
      {
        requiresAuth: true,
        schema: BaseResponseSchema(ApiKeyResponseSchema),
      }
    );
    return response.data!;
  }

  /**
   * Delete API key
   */
  static async deleteApiKey(keyId: string): Promise<void> {
    await api.delete(
      `/api/v1/users/api-keys/${keyId}`,
      {
        requiresAuth: true,
      }
    );
  }

  /**
   * Get user activity logs
   */
  static async getUserActivity(
    pageNumber: number = 1,
    pageSize: number = 20,
    action?: string,
    startDate?: string,
    endDate?: string
  ): Promise<UserActivity> {
    const params: Record<string, any> = {
      pageNumber,
      pageSize,
    };

    if (action) params.action = action;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get<any>(
      "/api/v1/users/activity",
      {
        params,
        requiresAuth: true,
        schema: BaseResponseSchema(UserActivityResponseSchema),
      }
    );
    return response.data!;
  }

  /**
   * Upload avatar
   */
  static async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<any>(
      "/api/v1/users/avatar",
      formData,
      {
        requiresAuth: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  /**
   * Delete avatar
   */
  static async deleteAvatar(): Promise<void> {
    await api.delete(
      "/api/v1/users/avatar",
      {
        requiresAuth: true,
      }
    );
  }

  /**
   * Export user data
   */
  static async exportUserData(): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/export`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to export user data");
    }

    return response.blob();
  }

  /**
   * Delete user account
   */
  static async deleteAccount(password: string): Promise<void> {
    await api.delete(
      "/api/v1/users/account",
      {
        requiresAuth: true,
        body: { password },
      }
    );
  }
}