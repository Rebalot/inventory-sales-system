import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable, timeout } from 'rxjs';
import { LoginPayload } from '../types/login-payload.type';
import { handleError } from 'src/common/helpers/errorHandler';

interface GrpcService {
  validateToken(data: { token: string }): Observable<any>;
  login(loginPayload: LoginPayload): Observable<any>;
}

@Injectable()
export class AuthService {
  private grpcService!: GrpcService; // Nombre del servicio en el proto
  constructor(@Inject('AUTH_SERVICE') private readonly clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.grpcService = this.clientGrpc.getService<GrpcService>('AuthService');
  }

  async validateToken(token: string) {
    try {
      return await firstValueFrom(
        this.grpcService.validateToken({ token }).pipe(timeout(3000)),
      );
    } catch (error: any) {
      handleError(error);
    }
  }

  async login(loginPayload: LoginPayload) {
    console.log('Login payload:', loginPayload)
    try {
      return await firstValueFrom(
        this.grpcService.login(loginPayload).pipe(timeout(3000)),
      );
    } catch (error: any) {
      handleError(error);
    }
  }
}