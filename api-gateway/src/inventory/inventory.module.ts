import { Module } from "@nestjs/common";
import { GrpcClientModule } from "src/common/grpc/grpc-client.module";
import { ProductController } from "./controllers/product.controller";
import { ProductService } from "./services/product.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [GrpcClientModule, AuthModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class InventoryModule {}