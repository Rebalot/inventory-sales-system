import { Inject, Injectable, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, TimeoutError } from 'rxjs';
import { User } from './types/user';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { mapRpcToHttp } from 'src/common/helper/rpc-to-http';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async validateToken(token: string): Promise<User> {
    try{
    return await firstValueFrom(
      this.authClient.send('auth.validate_token', token).pipe(
        timeout(3000)
      ),
    );
    }catch (error: any) {
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
  async login(loginData: LoginDto): Promise<string> {
    try{
    return await firstValueFrom(
      this.authClient.send('auth.login', loginData).pipe(
        timeout(3000)
      )
    );
    }catch (error: any) {
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
  async createUser(userData: CreateUserDto): Promise<User> {
    try{
      return await firstValueFrom(
      this.authClient.send('user.create', userData).pipe(
        timeout(3000)
      )
    );
    }catch (error: any) {
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

}