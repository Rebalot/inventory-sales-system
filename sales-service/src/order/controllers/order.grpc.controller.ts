import { Controller, UseFilters } from '@nestjs/common';
import { OrderService } from '../order.service';
import { GrpcMethod } from '@nestjs/microservices';
import { PrismaExceptionFilter } from '../../../src/common/filters/prisma-exception.filter';
import { CreateOrderInput } from '../types/create-order-input.interface';
import { GetOrdersQuery } from '../types/get-orders-query.interface';
import { PaginatedOrders } from '../types/order.interface';

@Controller()
export class OrderGrpcController {
    constructor(private readonly orderService: OrderService) {}
    
    @GrpcMethod('OrderService', 'GetPaginatedOrders')
    @UseFilters(PrismaExceptionFilter)
    async getPaginatedOrders(orderQuery: GetOrdersQuery): Promise<PaginatedOrders> {
      const paginatedOrders = await this.orderService.getPaginatedOrders(orderQuery);
      return paginatedOrders
    }

    @GrpcMethod('OrderService', 'CreateOrder')
    @UseFilters(PrismaExceptionFilter)
    async createOrder(orderData: CreateOrderInput) {
      console.log('createOrder orderData', orderData);
      const order = await this.orderService.createOrder(orderData);
      if (!order) {
        return {
          id: null,
          success: false,
          message: 'Order creation failed',
          order: null,
        };
      }
      console.log('order', order);
      return {
        id: order.id,
        success: true,
        message: 'Order created successfully',
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          customerId: order.customerId,
          date: order.date,
          total: order.total,
          status: order.status,
          paymentMethod: order.paymentMethod,
          items: order.items.map(item => ({
            productId: item.productId,
            productName: item.productName,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            subtotal: item.subtotal
          })),
        },
      }
    }

}