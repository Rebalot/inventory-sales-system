import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.REDIS,
        options: { 
          host: 'localhost',
          port: 6380
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RedisClientModule {}