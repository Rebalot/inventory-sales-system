import { Controller, UseFilters } from '@nestjs/common';
import { ProductService } from '../product.service';
import { GrpcMethod } from '@nestjs/microservices';
import { PaginatedProducts, Product, ProductPayload, ProductQuery, UpdateProductPayload } from '../types/product.interface';
import { PrismaExceptionFilter } from 'src/common/filters/prisma-exception.filter';
import { Category } from '@prisma/client';
import { rpcError } from 'src/common/exceptions/rpc-exception.util';
import { status } from '@grpc/grpc-js';

@Controller()
export class ProductGrpcController {
    constructor(private readonly productService: ProductService) {}
    
    @GrpcMethod('ProductService', 'Get')
    @UseFilters(PrismaExceptionFilter)
    async getProducts(productQuery: ProductQuery): Promise<PaginatedProducts> {
      const { items, totalItems, totalPages, currentPage } = await this.productService.getPaginatedProducts(productQuery);
      return {
        items,
        totalItems,
        totalPages,
        currentPage,
      };
    }

    @GrpcMethod('ProductService', 'Create')
    @UseFilters(PrismaExceptionFilter)
    async create(productData: ProductPayload): Promise<Product> {
      const product = await this.productService.createProduct(productData);
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        sku: product.sku,
      }
    }

    @GrpcMethod('ProductService', 'Update')
    @UseFilters(PrismaExceptionFilter)
    async update(productData: UpdateProductPayload): Promise<Product> {
      const product = await this.productService.updateProduct(productData);
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        sku: product.sku,
      }
    }
    
    @GrpcMethod('ProductService', 'Delete')
    @UseFilters(PrismaExceptionFilter)
    async delete({ id }: { id: string }): Promise<{message: string}> {
      console.log('ProductGrpcController delete', id);
      const product = await this.productService.deleteProduct(id);
      if (!product) {
        throw rpcError(status.NOT_FOUND, 'Product not found');
      } 
      return { message: 'Product deleted successfully' };
    }
    
}