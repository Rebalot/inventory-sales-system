import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthServiceClient } from './services/auth.service';
import { HttpAuthGuard } from './guards/http-auth.guard';
import { GrpcClientModule } from 'src/common/grpc/grpc-client.module';
import { UserServiceClient } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [GrpcClientModule],
  controllers: [AuthController, UserController],
  providers: [AuthServiceClient, UserServiceClient, HttpAuthGuard],
  exports: [ AuthServiceClient, HttpAuthGuard],
})
export class AuthModule {}