
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // =========================
  // STATIC FILES (UPLOADS)
  // =========================
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // =========================
  // CORS CONFIG
  // =========================
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // =========================
  // START SERVER
  // =========================
  await app.listen(3001);

  console.log(`🚀 Server running on http://localhost:3001`);
}

bootstrap();