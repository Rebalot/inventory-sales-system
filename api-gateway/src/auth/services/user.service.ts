import { Injectable, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable, timeout } from 'rxjs';
import { CreateUserDto } from '../dto/create-user.dto';
import { handleError } from 'src/common/helpers/errorHandler';

interface GrpcService {
  create(userData: CreateUserDto): Observable<any>;
}

@Injectable()
export class UserService implements OnModuleInit {
    private grpcService!: GrpcService; // Nombre del servicio en el proto
    constructor(@Inject('AUTH_SERVICE') private readonly clientGrpc: ClientGrpc) {}

    onModuleInit() {
        this.grpcService = this.clientGrpc.getService<GrpcService>('UserService');
    }

    async createUser(userData: CreateUserDto) {
        try {
        return await firstValueFrom(
            this.grpcService.create(userData).pipe(timeout(3000)),
        );
        } catch (error: any) {
        handleError(error);
        }
    }
}