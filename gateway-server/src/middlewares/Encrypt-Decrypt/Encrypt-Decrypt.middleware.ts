import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { decryptPayload, encryptPayload } from 'src/utils/CryptoJS';

@Injectable()
export class CryptoMiddleware implements NestMiddleware {
    
   use(req: Request, res: Response, next: NextFunction): void {
    if (
      (req.method === 'POST' || req.method === 'PUT') &&
      req.headers['content-type']?.includes('application/json') &&
      req.body?.data
    ) {
      try {
        console.log('Original request body:', req.body);
        const decrypted = decryptPayload(req.body.data);
        console.log('Decrypted request body:', decrypted);
        req.body = decrypted;
      } catch (err) {
        console.error('Decryption failed:', err);
        res.status(400).json({ error: 'Invalid encrypted payload' });
      }
    }

    const originalSend = res.send.bind(res);
    res.send = (body: any): Response => {
        try {
          const parsed = typeof body === 'string' ? JSON.parse(body) : body;
          const encrypted = encryptPayload(parsed);
          res.setHeader('Content-Type', 'application/json');
          originalSend(JSON.stringify({ data: encrypted }));
          return res;
        } catch (err) {
          console.error('Encryption failed:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          originalSend(JSON.stringify({ error: 'Response encryption failed' }));
          return res;
        }
    };

    next();
  }
}
