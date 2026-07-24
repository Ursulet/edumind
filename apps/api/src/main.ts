import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
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
  console.info(`🚀 EduCarieră API running on port ${port}`);
}
bootstrap();
