import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const X_USER_ID = 'x-user-id';

@Injectable()
export class UserIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const uid = request.headers[X_USER_ID];
    const id = typeof uid === 'string' ? parseInt(uid, 10) : Number(uid);
    if (Number.isNaN(id) || id < 1) {
      throw new UnauthorizedException('Missing or invalid X-User-Id header');
    }
    (request as Request & { user: { id: number } }).user = { id };
    return true;
  }
}
