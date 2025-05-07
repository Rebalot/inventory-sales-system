import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpAuthGuard } from './guards/http-auth.guard';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './types/autenticated-user.types';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { RpcException } from '@nestjs/microservices';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/me')
  @UseGuards(HttpAuthGuard)
  async getMe(@Req() req: AuthenticatedRequest) {
    console.log('User /me:', req.user);
    return req.user;
  }

  @Post('/create-user')
  async createUser(@Body() userData: CreateUserDto) {
    const user = await this.authService.createUser(userData);
    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      ...(user.lastName && { lastName: user.lastName }),
      avatar: user.avatar,
      role: user.role,
    };
  }

  @Post('/login')
  async login(@Body() loginData: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.login(loginData);
    res.cookie('access_token', user.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // solo en HTTPS si es true
      sameSite: 'lax', // permite el envío de cookies en solicitudes de origen cruzado
      maxAge: 1000 * 60 * 60 * 1, // 1 hora
    });
    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      ...(user.lastName && { lastName: user.lastName }),
      avatar: user.avatar,
      role: user.role,
    };
  }
  @Post('/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    console.log('Logging out...');
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { message: 'Logged out successfully' };
  }
}