import { Injectable, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable, timeout } from 'rxjs';
import { TimeoutError } from 'rxjs';
import { InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { mapRpcToHttp } from 'src/common/helpers/rpc-to-http';

interface GrpcService {
  createUser(userData: CreateUserDto): Observable<any>;
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
            this.grpcService.createUser(userData).pipe(timeout(3000)),
        );
        } catch (error: any) {
        this.handleError(error);
        }
    }

    private handleError(error: any) {
        const mongoServerError = error?.error;
        if (mongoServerError) {
        throw new InternalServerErrorException(mongoServerError);
        }
        if (error instanceof TimeoutError) {
        throw new ServiceUnavailableException('Authentication service did not respond in time');
        }
        throw mapRpcToHttp(error);
    }
}