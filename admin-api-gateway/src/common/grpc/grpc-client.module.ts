import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: ['auth', 'user'],
            protoPath: [
              join(__dirname, '../../../src/auth/proto/auth.proto'),
              join(__dirname, '../../../src/auth/proto/user.proto'),
            ],
            url: `localhost:${configService.get<string>('GRPC_AUTH_PORT') || '50051'}`,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'INVENTORY_PACKAGE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'product',
            protoPath: join(__dirname, '../../../src/inventory/proto/product.proto'),
            url: `localhost:${configService.get<string>('GRPC_INVENTORY_PORT') || '50051'}`,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'SALES_PACKAGE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'order',
            protoPath: join(__dirname, '../../../src/sales/proto/order.proto'),
            url: `localhost:${configService.get<string>('GRPC_SALES_PORT') || '50051'}`,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcClientModule {}