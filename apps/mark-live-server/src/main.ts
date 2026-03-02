import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1/mark-live');
  const port = process.env.PORT ? Number(process.env.PORT) : 8888;
  await app.listen(port);
  console.log(`mark-live-server running at http://localhost:${port}/api/v1/mark-live`);
}

bootstrap();
