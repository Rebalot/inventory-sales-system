import { Injectable, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable, timeout } from 'rxjs';
import { CreateProductDto } from '../dto/create-product.dto';
import { handleError } from 'src/common/helpers/errorHandler';
import { UpdateProductDto } from '../dto/update-product.dto';
import { UpdateProductPayload } from '../types/product.interface';

interface GrpcService {
    create(productData: CreateProductDto): Observable<any>;
    get(query: any): Observable<any>;
    update(productData: UpdateProductPayload): Observable<any>;
    delete({id}: {id: string}): Observable<any>;
}

@Injectable()
export class ProductService implements OnModuleInit {
    private grpcService!: GrpcService; // Nombre del servicio en el proto
    constructor(@Inject('INVENTORY_SERVICE') private readonly clientGrpc: ClientGrpc) {}

    onModuleInit() {
        this.grpcService = this.clientGrpc.getService<GrpcService>('ProductService');
    }
    async getProducts(query: any) {
        try {
            return await firstValueFrom(
                this.grpcService.get(query).pipe(timeout(3000)),
            );
        }
        catch (error: any) {
            handleError(error);
        }
    }
    async createProduct(productData: CreateProductDto) {
        try {
        return await firstValueFrom(
            this.grpcService.create(productData).pipe(timeout(3000)),
        );
        } catch (error: any) {
        handleError(error);
        }
    }
    async updateProduct(productData: UpdateProductPayload) {
        try {
            return await firstValueFrom(
                this.grpcService.update(productData).pipe(timeout(3000)),
            );
        } catch (error: any) {
            handleError(error);
        }
    }

    async deleteProduct(id: string) {
        try {
            console.log('ProductService deleteProduct', id);
            return await firstValueFrom(
                this.grpcService.delete({ id }).pipe(timeout(3000)),
            );
        } catch (error: any) {
            handleError(error);
        }
    }
    
//     async requestInventory(productId: number) {
//     return this.client.send('get_inventory', { productId }).toPromise();
//   }

}