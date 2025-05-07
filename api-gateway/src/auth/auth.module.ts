import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpAuthGuard } from './guards/http-auth.guard';
import { RedisClientModule } from '../common/redis/redis-client.module';

@Module({
  imports: [RedisClientModule],
  controllers: [AuthController],
  providers: [AuthService, HttpAuthGuard],
  exports: [AuthService, HttpAuthGuard],
})
export class AuthModule {}