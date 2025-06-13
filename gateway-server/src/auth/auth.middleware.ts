import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
const JWT_SECRET = 'my-secret-key';

const bypassKeywords = ['/cron', '/app'];

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const path = req.path;
    console.log('AuthMiddleware called for path:', path);
    if (bypassKeywords.some((keyword) => path.startsWith(keyword))) {
      console.log(`Bypassing auth for ${path} path`);
      return next();
    }
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      (req as Request & { user?: string | JwtPayload }).user = decoded;
      next();
    } catch (err: any) {
      console.error('JWT verification error:', err);
      res.status(403).json({ error: 'Invalid token' });
      return;
    }
  }
}
