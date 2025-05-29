import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductServiceClient } from '../../src/inventory-client/services/product.service';
import { CreateOrderInput } from './types/create-order-input.interface';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { lockProducts, unlockProducts } from '../../src/common/redis/redlock';
import { Order, OrderItem, Prisma } from '@prisma/client';
import { GetOrdersQuery } from './types/get-orders-query.interface';
import { OrderItemResponse, PaginatedOrders } from './types/order.interface';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private readonly productService: ProductServiceClient
  ) {}

  private async generateNextOrderNumber(
  prismaClient: PrismaService | Prisma.TransactionClient
  ): Promise<string> {
    const counterKey = 'order';

    const counter = await prismaClient.counter.upsert({
      where: { name: counterKey },
      update: { value: { increment: 1 } },
      create: { name: counterKey, value: 10000 },
    });

    return `ORD-${counter.value}`;
  }
  async getPaginatedOrders(orderQuery: GetOrdersQuery): Promise<PaginatedOrders> {
    const { page, limit, search, status, date } = orderQuery;
    console.log('getPaginatedOrders orderQuery', orderQuery);
    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerId: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (status) {
      whereClause.status = status;
    }
    if (date) {
      whereClause.date = {
        gte: new Date(date.gte),
        lte: new Date(date.lte)
      };
    }

    const skip = page * limit;
    console.log('whereClause', whereClause);
    const items = await this.prisma.order.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { orderNumber: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        customerId: true,
        date: true,
        total: true,
        status: true,
        paymentMethod: true,
        items: {
          select: {
            productId: true,
            productName: true,
            unitPrice: true,
            quantity: true,
            subtotal: true
          },
        },
      }
    });
    const total = await this.prisma.order.count({ where: whereClause });
    return {
      items,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }


  async createOrder(input: CreateOrderInput){
  const { customerId, paymentMethod, items } = input;

  const productIds = items.map(item => item.productId);
  const locks = await lockProducts(productIds);

    try{
  const products = await this.productService.getProductsByIds(productIds);
  console.log('products', products);

  const productsMap = new Map(products.map(p => [p.id, p]));

  let total = 0;
  const orderItems: OrderItemResponse[] = [];

  for (const item of items) {
    const product = productsMap.get(item.productId);
    if (!product) {
      throw new RpcException({ code: status.NOT_FOUND, message: `Product ${item.productId} not found` });
    }
    if (product.stock < item.quantity) {
      throw new RpcException({ code: status.CANCELLED, message: `Not enough stock for product ${item.productId}` });
    }

    const subtotal = product.price * item.quantity;
    total += subtotal;

    orderItems.push({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
      subtotal
    });
  }
    type OrderWithItems = Order & {
    items: OrderItem[];
  };
  const createdOrder: OrderWithItems = await this.prisma.$transaction(async tx => {
    const orderNumber = await this.generateNextOrderNumber(tx);
    const order = await tx.order.create({
      data: {
        orderNumber,
        customerId,
        paymentMethod,
        total,
        status: 'PROCESSING',
        items: {
          create: orderItems,
        },
      },
      include: { items: true },
    });

    return order;
  });

  await this.productService.updateStockBulk(items);

  return createdOrder;
  } catch(error){
    throw new RpcException({
      code: error.code || status.INTERNAL,
      message: error.message || 'Internal server error',
    });
  }finally {
    await unlockProducts(locks);
  }
  }
}