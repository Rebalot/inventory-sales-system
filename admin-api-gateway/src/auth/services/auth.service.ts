import { Injectable, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable, timeout } from 'rxjs';
import { LoginPayload } from '../types/login-payload.type';
import { handleError } from 'src/common/helpers/errorHandler';

interface AuthGrpcService {
  validateToken(data: { token: string }): Observable<any>;
  login(loginPayload: LoginPayload): Observable<any>;
}

@Injectable()
export class AuthServiceClient implements OnModuleInit {
  private authService!: AuthGrpcService;

  constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthGrpcService>('AuthService');
  }

  async validateToken(token: string) {
    try {
      return await firstValueFrom(
        this.authService.validateToken({ token }).pipe(timeout(3000)),
      );
    } catch (error: any) {
      handleError(error);
    }
  }

  async login(loginPayload: LoginPayload) {
    console.log('Login payload:', loginPayload)
    try {
      return await firstValueFrom(
        this.authService.login(loginPayload).pipe(timeout(3000)),
      );
    } catch (error: any) {
      handleError(error);
    }
  }
}