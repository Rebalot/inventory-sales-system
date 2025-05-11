import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Microservicio gRPC
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['auth', 'user'],
      protoPath: [
        join(__dirname, '../src/common/proto/auth.proto'),
        join(__dirname, '../src/common/proto/user.proto'),
      ],
      url: '0.0.0.0:50051',
    },
  });

  // Microservicio Redis
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  });

  await app.startAllMicroservices();
  // app.listen()
}
bootstrap();
