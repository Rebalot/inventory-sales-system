import { Module } from "@nestjs/common";
import { GrpcClientModule } from "src/common/grpc/grpc-client.module";
import { AuthModule } from "src/auth/auth.module";
import { OrderController } from "./controllers/order.controller";
import { OrderServiceClient } from "./services/order.service";

@Module({
    imports: [GrpcClientModule, AuthModule],
    controllers: [OrderController],
    providers: [OrderServiceClient],
})
export class SalesModule {}