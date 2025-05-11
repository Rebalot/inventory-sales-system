import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: ['auth', 'user'],
          protoPath: [
            join(__dirname, '../../../src/auth/proto/auth.proto'),
            join(__dirname, '../../../src/auth/proto/user.proto'),
          ],
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  exports: [ClientsModule]
})
export class GrpcClientModule {}