type RouteConfig = {
  prefix: string;
  target: string;
  pathRegex?: RegExp;
  middlewares?: string[];
};

export const routes: RouteConfig[] = [
  {
    prefix: '/backend1',
    target: 'http://localhost:3000',
    middlewares: ['LoggerMiddleware'],
  },
  {
    prefix: '/backend2',
    target: 'http://localhost:3001',
    middlewares: ['LoggerMiddleware', 'AuthMiddleware'],
  },
];
