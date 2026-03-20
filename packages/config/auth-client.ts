/**
 * 公共认证客户端：身份校验与请求登录，供各 app 复用
 * 来自根目录 .env.development / .env.production 的 VITE_AUTH_API_BASE_URL
 */

export const AUTH_API_BASE_URL =
  (import.meta.env?.VITE_AUTH_API_BASE_URL as string) || 'http://localhost:8888/api/v1/auth';

export const AUTH_API_REDIRECT_URI_SESSION_NAME =
  (import.meta.env?.VITE_AUTH_API_REDIRECT_URI_SESSION_NAME as string) || 'auth_redirect_uri';

export const AUTH_API_CODE_VERIFIER_SESSION_NAME =
  (import.meta.env?.VITE_AUTH_API_CODE_VERIFIER_SESSION_NAME as string) || 'auth_code_verifier';

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
export async function requestLogin(
  redirectUri: string,
  options: RequestLoginOptions = {},
): Promise<void> {
  sessionStorage.setItem(AUTH_API_REDIRECT_URI_SESSION_NAME, redirectUri);
  const baseUrl = options.authApiBaseUrl ?? AUTH_API_BASE_URL;
  const clientId = options.clientId ?? '';
  const { verifier, challenge } = await generatePKCE();
  sessionStorage.setItem(AUTH_API_CODE_VERIFIER_SESSION_NAME, verifier);
  const query = new URLSearchParams({ redirect_uri: redirectUri });
  query.set('code_challenge', challenge);
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
  const redirect_uri = sessionStorage.getItem(AUTH_API_REDIRECT_URI_SESSION_NAME);
  const code = params.get('code');
  const code_verifier = sessionStorage.getItem(AUTH_API_CODE_VERIFIER_SESSION_NAME);
  console.log('client_id', client_id);
  console.log('code', code);
  if (!client_id || !code) {
    throw new Error('query 中缺少 client_id 或 code');
  }
  const res = await fetch(`${baseUrl}/token-by-code`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id, code, redirect_uri, code_verifier }),
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

export type RefreshTokenOptions = {
  authApiBaseUrl?: string;
};

/**
 * 刷新 Access Token：POST /refresh，浏览器自动携带 refresh_token Cookie。
 * 成功后服务端通过 Set-Cookie 轮换 auth_token 和 refresh_token（204 无响应体）。
 * refresh_token 已过期或被吊销时抛错，调用方应跳转登录页。
 */
export async function refreshToken(options: RefreshTokenOptions = {}): Promise<void> {
  const baseUrl = options.authApiBaseUrl ?? AUTH_API_BASE_URL;
  const res = await fetch(`${baseUrl}/refresh`, {
    method: 'POST',
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
}

/**
 * 带自动刷新的 fetch 封装：
 * 请求返回 401 时自动调用 refreshToken() 重试一次；
 * 刷新失败则将原始 401 错误继续抛出，由调用方决定是否跳转登录。
 */
export async function fetchWithRefresh(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: RefreshTokenOptions = {},
): Promise<Response> {
  const reqInit: RequestInit = { credentials: 'include', ...init };
  const res = await fetch(input, reqInit);
  if (res.status !== 401) return res;

  await refreshToken(options);
  return fetch(input, reqInit);
}

export async function generatePKCE(): Promise<{ verifier: string; challenge: string }> {
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(48)));
  const challenge = base64url(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)),
  );
  return { verifier, challenge };
}
function base64url(buffer: ArrayBuffer | Uint8Array): string {
  // 1. 将 ArrayBuffer 或 Uint8Array 转为二进制字符串
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  // 2. 转换为标准 Base64
  const base64 = btoa(binary);

  // 3. 转换为 Base64URL 格式
  return base64
    .replace(/\+/g, '-') // '+' -> '-'
    .replace(/\//g, '_') // '/' -> '_'
    .replace(/=+$/, ''); // 去掉末尾的 '='
}
