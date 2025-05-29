import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable, timeout } from 'rxjs';
import { handleError } from '../../../src/common/helpers/errorHandler';
import { Product } from '../types/product.interface';

interface ProductServiceGrpc {
  getProductsByIds(data: { ids: string[] }): Observable<{ products: Product[] }>;
  updateStockBulk(data: { items: { productId: string; quantity: number }[] }): Observable<{ success: boolean }>;
  getProductsBulk(data: { limit: number }): Observable<{ products: Product[] }>;
}

@Injectable()
export class ProductServiceClient implements OnModuleInit {
  private productService: ProductServiceGrpc;

  constructor(@Inject('INVENTORY_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductServiceGrpc>('ProductService');
  }

  async getProductsByIds(ids: string[]) {
    try {
        const response = await firstValueFrom(
            this.productService.getProductsByIds({ ids }).pipe(timeout(3000)),
        );
        return response.products;
    }
    catch (error: any) {
        handleError(error);
    }
  }

  async updateStockBulk(items: { productId: string; quantity: number }[]) {
    console.log('ProductService updateStockBulk', items);
    try {
        return await firstValueFrom(
            this.productService.updateStockBulk({ items }).pipe(timeout(3000)),
        );
    }
    catch (error: any) {
        handleError(error);
    }
  }

  async getProductsBulk(limit: number){
    try {
        const response = await firstValueFrom(
            this.productService.getProductsBulk({ limit }).pipe(timeout(3000)),
        );
        return response.products;
    }
    catch (error: any) {
        handleError(error);
    }
  }
}