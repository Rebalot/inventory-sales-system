import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ConfigModule } from '@nestjs/config';
import { InventoryModule } from './inventory/inventory.module';
import { GrpcClientModule } from './common/grpc/grpc-client.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GrpcClientModule,
    AuthModule,
    InventoryModule,
    SalesModule,
    DashboardModule
  ],
})
export class AppModule {}