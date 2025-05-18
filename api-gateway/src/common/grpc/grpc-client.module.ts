import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: ['auth', 'user'],
            protoPath: [
              join(__dirname, '../../../src/auth/proto/auth.proto'),
              join(__dirname, '../../../src/auth/proto/user.proto'),
            ],
            url: `0.0.0.0:${configService.get<string>('GRPC_AUTH_PORT') || '50051'}`,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'INVENTORY_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'product',
            protoPath: join(__dirname, '../../../src/inventory/proto/product.proto'),
            url: `0.0.0.0:${configService.get<string>('GRPC_INVENTORY_PORT') || '50051'}`,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcClientModule {}