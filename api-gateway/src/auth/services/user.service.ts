import { Injectable, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable, timeout } from 'rxjs';
import { CreateUserDto } from '../dto/create-user.dto';
import { handleError } from 'src/common/helpers/errorHandler';

interface UserGrpcService {
  create(userData: CreateUserDto): Observable<any>;
}

@Injectable()
export class UserServiceClient implements OnModuleInit {
    private userService!: UserGrpcService;

    constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

    onModuleInit() {
        this.userService = this.client.getService<UserGrpcService>('UserService');
    }

    async createUser(userData: CreateUserDto) {
        try {
        return await firstValueFrom(
            this.userService.create(userData).pipe(timeout(3000)),
        );
        } catch (error: any) {
        handleError(error);
        }
    }
}