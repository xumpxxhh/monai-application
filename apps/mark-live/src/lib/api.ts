import type { User, Transaction } from '../types';
import {
  validateAuth as validateAuthFromConfig,
  requestLogin as requestLoginFromConfig,
  logout as logoutFromConfig,
  exchangeTokenByCode as exchangeTokenByCodeFromConfig,
  getUserInfo as getUserInfoFromConfig,
} from 'config';

export const API_BASE_URL =
  (import.meta.env.VITE_MARK_LIVE_API_BASE_URL as string) ||
  'http://localhost:8889/api/v1/mark-live';
const APP_NAME = (import.meta.env.VITE_APP_MARK_LIVE_NAME as string) || 'mark-live';

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
    const textData = await response.text().catch(() => '');
    data = { message: textData || response.statusText || 'Non-JSON error response' };
  }

  if (!response.ok) {
    throw {
      code: data.code || 'HTTP_ERROR',
      message: data.message || 'An unknown error occurred',
      status: response.status,
    };
  }

  return data as T;
}

/** FormData 请求（multipart/form-data），不设置 Content-Type 以让浏览器自动添加 boundary */
export async function apiRequestFormData<T>(
  endpoint: string,
  method: string = 'POST',
  formData: FormData,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    credentials: 'include',
    body: formData,
    // 不设置 Content-Type，浏览器会自动设置 multipart/form-data; boundary=...
  });

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json().catch(() => ({}));
  } else {
    const textData = await response.text().catch(() => '');
    data = { message: textData || response.statusText || 'Non-JSON error response' };
  }

  if (!response.ok) {
    throw {
      code: data.code || 'HTTP_ERROR',
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

// ========== 账单接口 ==========

export type ListBillsParams = {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
};

export type ListBillsResponse = {
  items: Transaction[];
  total: number;
  page: number;
  pageSize: number;
};

/** 获取账单列表 */
export function listBills(params?: ListBillsParams): Promise<ListBillsResponse> {
  const search = new URLSearchParams();
  if (params?.page != null) search.set('page', String(params.page));
  if (params?.pageSize != null) search.set('pageSize', String(params.pageSize));
  if (params?.startDate) search.set('startDate', params.startDate);
  if (params?.endDate) search.set('endDate', params.endDate);
  const qs = search.toString();
  return apiRequest<ListBillsResponse>(`/bills${qs ? `?${qs}` : ''}`);
}

/** 新增账单（JSON） */
export function createBill(body: {
  type: 'income' | 'expense';
  title: string;
  amount: number;
  category: string;
  time: string;
  remark?: string;
  imageUrl?: string;
}): Promise<Transaction> {
  return apiRequest<Transaction>('/bills', 'POST', body);
}

/** 新增账单（FormData，支持图片上传） */
export function createBillFormData(data: {
  type: 'income' | 'expense';
  title: string;
  amount: number;
  category: string;
  time: string;
  remark?: string;
  imageFile?: File;
}): Promise<Transaction> {
  const formData = new FormData();
  formData.append('type', data.type);
  formData.append('title', data.title);
  formData.append('amount', String(data.amount));
  formData.append('category', data.category);
  formData.append('time', data.time);
  if (data.remark) formData.append('remark', data.remark);
  if (data.imageFile) {
    formData.append('fileName', data.imageFile.name);
    formData.append('file', data.imageFile);
  }
  return apiRequestFormData<Transaction>('/bills', 'POST', formData);
}

/** 删除账单（软删除） */
export function deleteBill(id: string): Promise<void> {
  return apiRequest<void>(`/bills/${id}`, 'DELETE');
}
