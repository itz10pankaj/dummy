import { AuthMiddleware } from './auth/auth.middleware';
import { LoggerMiddleware } from './logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProxyController } from './proxy/proxy.controller';
import { routes } from './routes';

@Module({
  controllers: [ProxyController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    for (const route of routes) {
      const middlewareFns: Array<any> = [];

      for (const mw of route.middlewares || []) {
        if (mw === 'LoggerMiddleware') middlewareFns.push(LoggerMiddleware);
        if (mw === 'AuthMiddleware') middlewareFns.push(AuthMiddleware);
      }

      if (middlewareFns.length > 0) {
        const path = typeof route.pathRegex === 'string' ? route.pathRegex : route.prefix;
        consumer.apply(...middlewareFns).forRoutes(path);
      }
    }
  }
}
