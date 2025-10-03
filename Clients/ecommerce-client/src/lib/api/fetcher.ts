import { z } from 'zod';

interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined'
    ? window.sessionStorage.getItem('accessToken')
    : null;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('accessToken');
        window.location.href = '/auth/login';
      }
    }

    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.code || 'UNKNOWN_ERROR',
      errorData.message || 'An error occurred',
      response.status
    );
  }

  const data = await response.json();
  return data as T;
}

export function createApiFetcher<TSchema extends z.ZodType>(schema: TSchema) {
  return async <ResponseType = z.infer<TSchema>>(
    url: string,
    options?: RequestInit
  ): Promise<ResponseType> => {
    const response = await fetchApi<ApiResponse<ResponseType>>(url, options);

    if (response.error) {
      throw new ApiError(response.error.code, response.error.message);
    }

    if (response.data && schema) {
      return schema.parse(response.data);
    }

    return response.data as ResponseType;
  };
}

export { fetchApi, ApiError };
