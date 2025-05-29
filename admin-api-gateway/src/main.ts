import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // Permitir todas las solicitudes CORS
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true, // Lanza error si hay propiedades no definidas en el DTO
    transform: true,
  }));
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();