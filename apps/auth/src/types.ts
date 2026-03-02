export interface User {
  id: number;
  role: string;
  email?: string;
  username?: string;
}

export interface AuthResponse {
  token?: string;
  id?: number;
  role?: string;
  code?: string;
  message?: string;
  redirect_url?: string;
}

export interface ApiError {
  code: string;
  message: string;
  status?: number;
}

/** 用于 catch 中、可能带 code/message 的未知错误 */
export type CaughtAuthError = { code?: string; message?: string };
