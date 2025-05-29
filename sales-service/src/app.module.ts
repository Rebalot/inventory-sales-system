import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { PrismaModule } from './prisma/prisma.module';
import { InventoryModule } from './inventory-client/inventory.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    InventoryModule, //Global client module for inventory-service
    OrderModule,

  ],
})
export class AppModule {}
