import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { HttpAuthGuard } from "src/auth/guards/http-auth.guard";
import { User } from "src/auth/types/user.interface";
import { OrderServiceClient } from "../services/order.service";
import { GetOrdersQuery } from "../dto/get-orders-query.dto";

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('api/sales')
export class OrderController {
  constructor(private readonly orderService: OrderServiceClient) {}

    //Order
    @Get('/get-orders')
    async getOrders(@Query() query: GetOrdersQuery) {
      console.log('get orders query', query);
      const orders = await this.orderService.getOrders(query);
      return orders;
    }
}