import { z } from 'zod';

import { authStore } from '@/lib/state/auth-store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://mock.api.local';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number
  ) {
    super(message);
  }
}

type FetcherOptions<TSchema extends z.ZodTypeAny> = {
  schema: TSchema;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
};

export async function apiFetch<TSchema extends z.ZodTypeAny>(
  endpoint: string,
  { schema, method = 'GET', body, headers, query }: FetcherOptions<TSchema>
): Promise<z.infer<TSchema>> {
  const token = authStore.getState().token;

  const searchParams = new URLSearchParams();
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
  }

  const url = `${API_BASE_URL}${endpoint}${searchParams.size ? `?${searchParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include'
  });

  const contentType = response.headers.get('content-type');
  const payload = contentType?.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const normalized = payload && typeof payload === 'object' ? payload : null;
    throw new ApiError(
      normalized?.message ?? response.statusText,
      normalized?.code ?? 'unknown_error',
      response.status
    );
  }

  return schema.parse(payload);
}
