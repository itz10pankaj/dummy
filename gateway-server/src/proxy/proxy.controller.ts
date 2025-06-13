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
          pathRewrite: (path) => path.replace(route.prefix, ''),
        });

        return proxy(req, res, () => {});
      }
    }

    return res.status(404).json({ error: 'Not Found' });
  }
}
