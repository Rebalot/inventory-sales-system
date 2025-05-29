import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ProductServiceClient } from './services/product.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'INVENTORY_PACKAGE',
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'product',
            protoPath: join(__dirname, '../../../src/common/proto/product.proto'),
            url: `localhost:${configService.get<string>('GRPC_INVENTORY_PORT') || '50051'}`,
          }
        }),
      },
    ]),
  ],
  providers: [ProductServiceClient],
  exports: [ProductServiceClient],
})
export class InventoryModule {}