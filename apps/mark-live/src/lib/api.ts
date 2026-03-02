import type { User } from '../types';
import {
  validateAuth as validateAuthFromConfig,
  requestLogin as requestLoginFromConfig,
  logout as logoutFromConfig,
  exchangeTokenByCode as exchangeTokenByCodeFromConfig,
  getUserInfo as getUserInfoFromConfig,
} from 'config';

export const API_BASE_URL = 'http://localhost:8888/api/v1/mark-live';
const APP_NAME = 'mark-live';

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
  body?: unknown,
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

/** 身份校验（复用 config 公共方法） */
export const validateAuth = (): Promise<User> => validateAuthFromConfig() as Promise<User>;

/** 请求登录并跳转（复用 config 公共方法，带本应用 clientId） */
export const requestLogin = (redirectUri: string): Promise<void> =>
  requestLoginFromConfig(redirectUri, { clientId: APP_NAME });

/** 登出（复用 config 公共方法） */
export const logout = (): Promise<void> => logoutFromConfig();

/** 用 code 置换 token（复用 config 公共方法） */
export const exchangeTokenByCode = (): Promise<{ token?: string; [k: string]: unknown }> =>
  exchangeTokenByCodeFromConfig({ clientId: APP_NAME });

/** 获取用户信息（复用 config 公共方法） */
export const getUserInfo = () => getUserInfoFromConfig();
