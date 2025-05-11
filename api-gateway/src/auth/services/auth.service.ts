import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable, timeout } from 'rxjs';
import { TimeoutError } from 'rxjs';
import { InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { mapRpcToHttp } from 'src/common/helpers/rpc-to-http';
import { LoginPayload } from '../types/login-payload.type';

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
      this.handleError(error);
    }
  }

  async login(loginPayload: LoginPayload) {
    console.log('Login payload:', loginPayload)
    try {
      const loginResponse = await firstValueFrom(
        this.grpcService.login(loginPayload).pipe(timeout(3000)),
      );
      console.log('Login response:', loginResponse);
      return loginResponse;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    console.error('Error en AuthService:', error);
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