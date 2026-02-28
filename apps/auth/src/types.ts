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
}

export interface ApiError {
  code: string;
  message: string;
  status?: number;
}
