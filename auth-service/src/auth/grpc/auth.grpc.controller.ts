import { Controller } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AuthGrpcController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Login')
  async login(data: { email: string; password: string }) {
    const user = await this.authService.validateUser(data.email, data.password);
    const token = await this.authService.login(user);
    return { accessToken: token };
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  async validate(data: { token: string }) {
    const user = await this.authService.validateToken(data.token);
    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
    };
  }
}