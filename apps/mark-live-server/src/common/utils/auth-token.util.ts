import { Request } from 'express';

export function getAuthTokenFromRequest(
  req: Request,
  cookieName: string = 'auth_token',
): string | null {
  const token =
    (req.cookies && req.cookies[cookieName]) ??
    getTokenFromCookieHeader(req.headers.cookie, cookieName);
  return token && typeof token === 'string' ? token : null;
}

function getTokenFromCookieHeader(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1].trim()) : null;
}
