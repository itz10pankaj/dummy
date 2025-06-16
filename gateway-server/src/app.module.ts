import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { CryptoMiddleware } from './middlewares/Encrypt-Decrypt/Encrypt-Decrypt.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyController } from './proxy/proxy.controller';
import { NotificationController } from './Email/email.controller';
import { routes } from './routes';

@Module({
    imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
  ],
  controllers: [NotificationController, ProxyController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    for (const route of routes) {
      const middlewareFns: Array<any> = [];

      for (const mw of route.middlewares || []) {
        if (mw === 'LoggerMiddleware') middlewareFns.push(LoggerMiddleware);
        if (mw === 'AuthMiddleware') middlewareFns.push(AuthMiddleware);
        if (mw === 'CryptoMiddleware') middlewareFns.push(CryptoMiddleware);
      }

      if (middlewareFns.length > 0) {
        const path = route.prefix;
        consumer.apply(...middlewareFns).forRoutes(path);
      }
    }
  }
  
}
