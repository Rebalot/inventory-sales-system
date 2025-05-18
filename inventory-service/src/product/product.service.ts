import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedProducts, ProductPayload, ProductQuery, UpdateProductPayload } from './types/product.interface';
import { Product as Product } from '@prisma/client';

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
      orderBy: { numericId: 'asc' },
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
    const last = await this.prisma.product.findFirst({
    orderBy: { numericId: 'desc' },
    select: { numericId: true },
    });
    const numericId = last?.numericId ? last.numericId + 1 : 1000;
    const id = `PRD-${numericId}`;
    return this.prisma.product.create({ data: {...productData, id, numericId} });
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
}