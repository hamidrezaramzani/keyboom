import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as useragent from 'express-useragent';
import { LoggingInterceptor } from './core/interceptors/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [
      'http://10.65.165.96:3000',
      'http://localhost:3000',
      'https://keyboom.ir',
    ],
    credentials: true,
  });

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.use(useragent.express());

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
