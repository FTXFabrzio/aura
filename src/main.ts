import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Variable para cachear la instancia de la aplicación
let app: any;

async function getAppInstance() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  }
  return app.getHttpAdapter().getInstance();
}

// Exportamos la función por defecto que Vercel requiere
export default async (req: any, res: any) => {
  const instance = await getAppInstance();
  return instance(req, res);
};

// Mantenemos esto solo para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  async function bootstrap() {
    const localApp = await NestFactory.create(AppModule);
    localApp.useGlobalPipes(new ValidationPipe());
    await localApp.listen(3000);
  }
  bootstrap();
}
