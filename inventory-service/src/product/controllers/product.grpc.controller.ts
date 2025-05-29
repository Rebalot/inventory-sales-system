import { Controller, UseFilters } from '@nestjs/common';
import { ProductService } from '../product.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { PaginatedProducts, ProductPayload, ProductQuery, ProductResponse, UpdateProductPayload } from '../types/product.interface';
import { PrismaExceptionFilter } from 'src/common/filters/prisma-exception.filter';
import { status } from '@grpc/grpc-js';

@Controller()
export class ProductGrpcController {
    constructor(private readonly productService: ProductService) {}
    
    @GrpcMethod('ProductService', 'GetPaginatedProducts')
    @UseFilters(PrismaExceptionFilter)
    async getPaginatedProducts(productQuery: ProductQuery): Promise<PaginatedProducts> {
      const paginatedProducts = await this.productService.getPaginatedProducts(productQuery);
      return paginatedProducts
    }

    @GrpcMethod('ProductService', 'CreateProduct')
    @UseFilters(PrismaExceptionFilter)
    async create(productData: ProductPayload): Promise<ProductResponse> {
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

    @GrpcMethod('ProductService', 'UpdateProduct')
    @UseFilters(PrismaExceptionFilter)
    async update(productData: UpdateProductPayload): Promise<ProductResponse> {
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
    
    @GrpcMethod('ProductService', 'DeleteProduct')
    @UseFilters(PrismaExceptionFilter)
    async delete({ id }: { id: string }): Promise<{message: string}> {
      console.log('ProductGrpcController delete', id);
      const product = await this.productService.deleteProduct(id);
      if (!product) {
        throw new RpcException({code: status.NOT_FOUND, message: 'Product not found'});
      } 
      return { message: 'Product deleted successfully' };
    }
    
    @GrpcMethod('ProductService', 'GetProductsByIds')
    @UseFilters(PrismaExceptionFilter)
    async getProductsByIds({ ids }: { ids: string[] }): Promise<{products: ProductResponse[]}> {
      console.log('ProductGrpcController getProductsById', ids);
      const products = await this.productService.getProductsByIds(ids);
      return {
        products: products.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        sku: product.sku,
        }))
      }
    }
    @GrpcMethod('ProductService', 'UpdateStockBulk')
    @UseFilters(PrismaExceptionFilter)
    async updateStockBulk({ items }: { items: { productId: string; quantity: number }[] }): Promise<{ success: boolean }> {
      await this.productService.updateStockBulk(items);
      return { success: true };
    }
    
    @GrpcMethod('ProductService', 'GetProductsBulk')
    @UseFilters(PrismaExceptionFilter)
    async getProductsBulk({ limit }: { limit: number }): Promise<{ products: ProductResponse[] }> {
      const products = await this.productService.getProductsBulk(limit);
      return { products };
    }
}