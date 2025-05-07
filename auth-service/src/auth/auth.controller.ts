import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LoginPayload } from './types/login.types';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern('auth.login')
  async login(@Payload() payload: LoginPayload) {
    const { email, password } = payload;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new RpcException('Invalid credentials');
    }
    const { access_token } = await this.authService.login(user);
    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      ...(user.lastName && { lastName: user.lastName }),
      avatar: user.avatar,
      role: user.role,
      access_token,
    };
  }

  @MessagePattern('auth.validate_token')
  async validate(@Payload() token: string) {
    const user = await this.authService.validateToken(token);
    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      ...(user.lastName && { lastName: user.lastName }),
      avatar: user.avatar,
      role: user.role,
    };
  }
}