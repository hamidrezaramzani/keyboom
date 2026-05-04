import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import * as cookie from 'cookie';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();

    let token = null;

    if (client.handshake.headers.cookie) {
      const cookies = cookie.parse(client.handshake.headers.cookie);
      token = cookies['ACCESS_TOKEN'];
    }

    if (!token) {
      return false;
    }

    try {
      const payload = verify(token, process.env.JWT_SECRET!) as { sub: string };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      client.data.userId = payload.sub;
      return true;
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      return false;
    }
  }
}
