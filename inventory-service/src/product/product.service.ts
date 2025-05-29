import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedProducts, ProductPayload, ProductQuery, ProductResponse, UpdateProductPayload } from './types/product.interface';
import { Product } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getPaginatedProducts(productQuery: ProductQuery): Promise<PaginatedProducts> {
    console.log('getPaginatedProducts', productQuery);
    const { page, limit, search, status, category } = productQuery;
    
    const whereClause: any = {}
    if (search) {
      whereClause.OR = [
        { sku: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (status === "In Stock") {
      whereClause.stock = { gte: 10 }
    } else if (status === "Low Stock") {
      whereClause.stock = { lt: 10, gt: 0 }
    } else if (status === "Out of Stock") {
      whereClause.stock = 0
    }
    if (category) {
      whereClause.category = category;
    }

    const skip = page * limit;

  const items = await this.prisma.product.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { sku: 'asc' },
      select: {
      id: true,
      name: true,
      category: true,
      price: true,
      stock: true,
      sku: true
    },
    })
    const total = await this.prisma.product.count(
      { where: whereClause }
    );
    
    return {
      items,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
  async createProduct(productData: ProductPayload): Promise<Product> {
    return this.prisma.product.create({ data: productData });
  }

  async updateProduct(productData: UpdateProductPayload): Promise<Product> {
    const { id, ...data } = productData;
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }
  
  async deleteProduct(id: string): Promise<Product> {
      return this.prisma.product.delete({
      where: { id }
    });
  }
  async getProductsByIds(ids: string[]): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { id: { in: ids } },
    });
    if (products.length !== ids.length) {
      console.log('Some products not found', products);
      const foundIds = new Set(products.map(p => p.id));
      const missingIds = ids.filter(id => !foundIds.has(id));
      throw new RpcException({code: status.NOT_FOUND, message: `Products not found: ${missingIds.join(', ')}`});
    }
    return products;
  }
  async updateStockBulk(items: { productId: string; quantity: number }[]): Promise<Product[]> {
    return await this.prisma.$transaction(async (tx) => {
    const updatedProducts: Product[] = [];
      console.log('updateStockBulk', items);
    for (const item of items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || product.stock < item.quantity) {
        throw new RpcException({code: status.FAILED_PRECONDITION, message: `Not enough stock for product ${item.productId}`});
      }

      const updated = await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      updatedProducts.push(updated);
    }

    return updatedProducts;
  });
  }

  async getProductsBulk(limit: number): Promise<ProductResponse[]> {
    const products = await this.prisma.product.findMany({
      take: limit,
      orderBy: { sku: 'asc' },
      select: {
        id: true,
        name: true,
        category: true,
        price: true,
        stock: true,
        sku: true
      }
    });
    return products;
  }
}