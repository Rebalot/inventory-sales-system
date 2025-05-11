import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { HttpAuthGuard } from './guards/http-auth.guard';
import { GrpcClientModule } from 'src/common/grpc/grpc-client.module';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [GrpcClientModule],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService, HttpAuthGuard],
  exports: [ HttpAuthGuard],
})
export class AuthModule {}