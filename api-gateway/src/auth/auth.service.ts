import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthenticatedUser, AuthenticatedUserWithToken } from './types/autenticated-user.types';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async validateToken(token: string): Promise<AuthenticatedUser> {
    return firstValueFrom(
      this.authClient.send('auth.validate_token', token),
    );
  
  }
  async login(loginData: LoginDto): Promise<AuthenticatedUserWithToken> {
    return firstValueFrom(
      this.authClient.send('auth.login', loginData),
    );
  }
  async createUser(userData: CreateUserDto): Promise<AuthenticatedUser> {
    try{
      return await firstValueFrom(
      this.authClient.send('user.create', userData),
    );
    }catch (error: any) {
      if (error?.error?.message) {
        throw new BadRequestException(error.message); // HTTP 400
      }
      throw new InternalServerErrorException('Unexpected error while creating user');
    }
  }

}