import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  user_id?: number;
  sub?: string | number;
  /** Go JWT 生成的 UserID 字段 */
  UserID?: number;
  [key: string]: unknown;
}

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const cookieName = this.config.get<string>('auth.cookieName') ?? 'auth_token';
    const token =
      (request.cookies && request.cookies[cookieName]) ??
      this.getTokenFromCookieHeader(request.headers.cookie, cookieName);
    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('Missing auth_token cookie');
    }

    const secret = this.config.get<string>('auth.jwtSecret');
    if (!secret) {
      throw new UnauthorizedException('Server auth config error');
    }

    try {
      const payload = jwt.verify(token, secret) as JwtPayload;
      const id = payload['user_id'] ?? payload.id ?? payload.sub;
      const uid = typeof id === 'number' ? id : parseInt(String(id), 10);
      if (Number.isNaN(uid) || uid < 1) {
        throw new UnauthorizedException('Invalid token payload');
      }
      (request as Request & { user: { id: number } }).user = { id: uid };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired auth_token');
    }
  }

  private getTokenFromCookieHeader(cookieHeader: string | undefined, name: string): string | null {
    if (!cookieHeader) return null;
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1].trim()) : null;
  }
}
