import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

// Check if running on Vercel
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

// Export the app for Vercel
export const handler = async (req: any, res: any) => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};
