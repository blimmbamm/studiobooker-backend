import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = parseInt(configService.get<string>('PORT') || '3001', 10);
  const dashboardUrl =
    configService.get<string>('DASHBOARD_URL') || 'http://localhost:4200';
  const websiteUrl =
    configService.get<string>('WEBSITE_URL') || 'http://localhost:3000';

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin: [dashboardUrl, websiteUrl],

    credentials: true,
  });
  await app.listen(port);
}

bootstrap();
