import { Module } from "@nestjs/common";
import { OrderGrpcController } from "./controllers/order.grpc.controller";
import { OrderService } from "./order.service";


@Module({
    controllers: [OrderGrpcController],
    providers: [OrderService],
    })
export class OrderModule {}