import { Module } from "@nestjs/common";
import { ProductGrpcController } from "./controllers/product.grpc.controller";
import { ProductService } from "./product.service";

@Module({
    controllers: [ProductGrpcController],
    providers: [ProductService],
    })
export class ProductModule {}