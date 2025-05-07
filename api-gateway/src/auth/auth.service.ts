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
    try{
    return await firstValueFrom(
      this.authClient.send('auth.validate_token', token),
    );
  }catch (error: any) {
    console.error('Error auth.service:', error);
    const message = error?.message || error?.error?.message;
    if (message) {
      throw new BadRequestException(message); // HTTP 400
    }
    throw new InternalServerErrorException('Unexpected error while creating user');
  }
  }
  async login(loginData: LoginDto): Promise<AuthenticatedUserWithToken> {
    try{
    return await firstValueFrom(
      this.authClient.send('auth.login', loginData),
    );
  }catch (error: any) {
    console.error('Error auth.service:', error);
    const message = error?.message || error?.error?.message;
    if (message) {
      throw new BadRequestException(message); // HTTP 400
    }
    throw new InternalServerErrorException('Unexpected error while logging in');
  }
  }
  async createUser(userData: CreateUserDto): Promise<AuthenticatedUser> {
    try{
      return await firstValueFrom(
      this.authClient.send('user.create', userData),
    );
    }catch (error: any) {
      console.error('Error auth.service:', error);
      const message = error?.message || error?.error?.message;
    if (message) {
      throw new BadRequestException(message); // HTTP 400
    }
      throw new InternalServerErrorException('Unexpected error while creating user');
    }
  }

}