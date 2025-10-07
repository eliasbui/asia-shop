import { z } from "zod";
import { getAccessToken } from "@/lib/state/auth-store";
import { ApiErrorSchema } from "@/types/models";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface FetchOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: any;
  schema?: z.ZodType;
  requiresAuth?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    params,
    body,
    schema,
    requiresAuth = false,
    headers = {},
    ...fetchOptions
  } = options;
  
  // Build URL with query params
  const url = new URL(endpoint, API_BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  // Build headers
  const fetchHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };
  
  // Add auth token if required
  if (requiresAuth) {
    const token = getAccessToken();
    if (token) {
      fetchHeaders["Authorization"] = `Bearer ${token}`;
    } else {
      throw new ApiError(401, "AUTH_REQUIRED", "Authentication required");
    }
  }
  
  // Prepare body
  const fetchBody = body ? JSON.stringify(body) : undefined;
  
  try {
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers: fetchHeaders,
      body: fetchBody,
    });
    
    // Handle non-OK responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        const parsedError = ApiErrorSchema.safeParse(errorData);
        if (parsedError.success) {
          throw new ApiError(
            response.status,
            parsedError.data.code,
            parsedError.data.message,
            parsedError.data.details
          );
        }
      } catch {
        // Fallback for non-JSON error responses
      }
      
      throw new ApiError(
        response.status,
        "API_ERROR",
        `Request failed with status ${response.status}`
      );
    }
    
    // Parse response
    const data = await response.json();
    
    // Validate with schema if provided
    if (schema) {
      const result = schema.safeParse(data);
      if (!result.success) {
        console.error("Schema validation failed:", result.error);
        throw new ApiError(
          500,
          "VALIDATION_ERROR",
          "Response validation failed",
          result.error.flatten()
        );
      }
      return result.data;
    }
    
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new ApiError(
        0,
        "NETWORK_ERROR",
        "Network request failed. Please check your connection."
      );
    }
    
    throw new ApiError(
      500,
      "UNKNOWN_ERROR",
      error instanceof Error ? error.message : "An unknown error occurred"
    );
  }
}

// Convenience methods
export const api = {
  get: <T = any>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),
  
  post: <T = any>(endpoint: string, body?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "POST", body }),
  
  put: <T = any>(endpoint: string, body?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "PUT", body }),
  
  patch: <T = any>(endpoint: string, body?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "PATCH", body }),
  
  delete: <T = any>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
