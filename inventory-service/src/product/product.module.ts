import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ProductGrpcController } from "./controllers/product.grpc.controller";
import { ProductService } from "./product.service";

@Module({
    imports: [PrismaModule],
    controllers: [ProductGrpcController],
    providers: [ProductService],
    })
export class ProductModule {}