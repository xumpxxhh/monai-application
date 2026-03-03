/**
 * 公共认证客户端：身份校验与请求登录，供各 app 复用
 * 来自根目录 .env.development / .env.production 的 VITE_AUTH_API_BASE_URL
 */

export const AUTH_API_BASE_URL =
  (import.meta.env?.VITE_AUTH_API_BASE_URL as string) || 'http://localhost:8888/api/v1/auth';

export interface AuthUser {
  id: number;
  role: string;
  email?: string;
  username?: string;
}

export type ValidateAuthOptions = {
  authApiBaseUrl?: string;
};

export type RequestLoginOptions = {
  authApiBaseUrl?: string;
  clientId?: string;
};

/** 身份校验：成功返回用户信息，失败抛错 */
export async function validateAuth(options: ValidateAuthOptions = {}): Promise<AuthUser> {
  const baseUrl = options.authApiBaseUrl ?? AUTH_API_BASE_URL;
  const res = await fetch(`${baseUrl}/validate`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw {
      code: data?.code ?? 'UNAUTHORIZED',
      message: data?.message,
      status: res.status,
    };
  }
  return res.json();
}

/** 请求 request-login，从响应 JSON 的 login_url 跳转到登录页 */
export function requestLogin(
  redirectUri: string,
  options: RequestLoginOptions = {},
): Promise<void> {
  const baseUrl = options.authApiBaseUrl ?? AUTH_API_BASE_URL;
  const clientId = options.clientId ?? '';
  const query = new URLSearchParams({ redirect_uri: redirectUri });
  if (clientId) query.set('client_id', clientId);
  const url = `${baseUrl}/request-login?${query.toString()}`;
  return fetch(url, { method: 'GET', credentials: 'include', redirect: 'manual' })
    .then((res) => res.json())
    .then((data: { login_url?: string }) => {
      const location = data?.login_url;
      if (location) {
        window.location.href = location;
      }
    });
}

export type LogoutOptions = {
  authApiBaseUrl?: string;
};

/** 登出：请求 /logout，成功或失败均不抛错，由调用方处理 UI */
export async function logout(options: LogoutOptions = {}): Promise<void> {
  const baseUrl = options.authApiBaseUrl ?? AUTH_API_BASE_URL;
  await fetch(`${baseUrl}/logout`, { method: 'POST', credentials: 'include' });
}

export type TokenByCodeOptions = {
  authApiBaseUrl?: string;
  clientId: string;
};

/** 用 code 置换 token：从 query 中取 client_id 和 code，POST /token-by-code */
export async function exchangeTokenByCode(
  options: TokenByCodeOptions,
): Promise<{ token?: string; [k: string]: unknown }> {
  const baseUrl = options?.authApiBaseUrl ?? AUTH_API_BASE_URL;
  const params = new URLSearchParams(window.location.search);
  const client_id = options.clientId;
  const code = params.get('code');
  console.log('client_id', client_id);
  console.log('code', code);
  if (!client_id || !code) {
    throw new Error('query 中缺少 client_id 或 code');
  }
  const res = await fetch(`${baseUrl}/token-by-code`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id, code }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw {
      code: data?.code ?? 'TOKEN_EXCHANGE_FAILED',
      message: data?.message,
      status: res.status,
    };
  }
  // 删除 code 参数
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  window.history.replaceState({}, document.title, url.toString());
  return res.json();
}

export interface IUserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

export async function getUserInfo(): Promise<AuthUser> {
  const baseUrl = AUTH_API_BASE_URL;
  const res = await fetch(`${baseUrl}/me`, { method: 'GET', credentials: 'include' });
  if (!res.ok) {
    throw new Error('获取用户信息失败');
  }
  return res.json() as Promise<IUserInfo>;
}
