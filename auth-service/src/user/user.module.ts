import { UserGrpcController } from "./grpc/user.grpc.controller";
import { UserService } from "./user.service";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserGrpcController],
  providers: [UserService],
  exports: [UserService]
  })
  export class UserModule {}