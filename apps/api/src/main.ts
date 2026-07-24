import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/v1', {
    // Exclude root path from prefix so healthchecks work
    exclude: ['/'],
  });
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors({
    origin: [
      process.env.CORS_ORIGIN || 'https://edumind.stefandevelopment.ro',
      'http://localhost:3000',
    ],
    credentials: true,
  });

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');
  console.info(`🚀 EduMind API running on port ${port}`);
}
bootstrap();
