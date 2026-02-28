export const API_BASE_URL = 'http://localhost:8888/api/v1/auth';

export type AuthResponse = {
  token?: string;
  id?: number;
  role?: string;
  code?: string;
  message?: string;
};

export type ApiError = {
  code: string;
  message: string;
};

export async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  body?: unknown
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json().catch(() => ({}));
  } else {
    data = {};
  }

  if (!response.ok) {
    throw {
      code: data.code || 'UNKNOWN_ERROR',
      message: data.message || 'An unknown error occurred',
      status: response.status,
    };
  }

  return data as T;
}
