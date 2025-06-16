import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { routes } from '../routes';
@Controller()
export class ProxyController {
  @All('*')
  proxy(@Req() req: Request, @Res() res: Response) {
    for (const route of routes) {
      const match = req.url.startsWith(route.prefix);
      if (match) {
        const proxy = createProxyMiddleware({
          target: route.target,
          changeOrigin: true,
          selfHandleResponse: true,
          pathRewrite: (path) => path.replace(route.prefix, ''),
          on: {
            proxyReq: (proxyReq, req: Request) => {
              if (
                req.method === 'POST' || req.method === 'PUT' &&
                req.headers['content-type']?.includes('application/json') &&
                req.body
              ) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
              }
            },
            proxyRes: (proxyRes, req: Request, res: Response) => {
              let body = Buffer.from([]);
              proxyRes.on('data', (chunk) => {
                body = Buffer.concat([body, chunk]);
              });
              proxyRes.on('end', () => {
                try {
                  const bodyString = body.toString('utf-8');
                  const parsed = JSON.parse(bodyString);
                  res.setHeader('Content-Type', 'application/json');
                  res
                    .status(proxyRes.statusCode || 200)
                    .send({ data: parsed });
                } catch (error) {
                  console.error('Error processing proxy response:', error);
                  res
                    .status(500)
                    .send({ error: 'Error in processing proxy response' });
                }
              });
            },
          },
        });
        return proxy(req, res, () => { });
      }
    }

    return res.status(404).json({ error: 'Not Found' });
  }
}