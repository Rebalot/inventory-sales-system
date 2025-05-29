import { Injectable, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable, timeout } from 'rxjs';
import { handleError } from 'src/common/helpers/errorHandler';
import { GetOrdersQuery } from '../dto/get-orders-query.dto';

interface OrderGrpcService {
    getPaginatedOrders(query: GetOrdersQuery): Observable<any>;
}

@Injectable()
export class OrderServiceClient implements OnModuleInit {
  private orderService!: OrderGrpcService;

  constructor(@Inject('SALES_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.orderService = this.client.getService<OrderGrpcService>('OrderService');
  }
    async getOrders(query: GetOrdersQuery) {
        console.log('get orders query', query)
        try {
            return await firstValueFrom(
                this.orderService.getPaginatedOrders(query).pipe(timeout(3000)),
            );
        }
        catch (error: any) {
            handleError(error);
        }
    }

}