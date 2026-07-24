import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors();

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.info(`🚀 EduCarieră API server running on port ${port} with prefix /api/v1`);
}
bootstrap();
