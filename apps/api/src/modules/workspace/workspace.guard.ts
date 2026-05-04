import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.auth.token; // از auth گرفته می‌شود

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };
      client.data.userId = payload.userId;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
