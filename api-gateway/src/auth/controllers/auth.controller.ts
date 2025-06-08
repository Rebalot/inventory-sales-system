import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpAuthGuard } from '../guards/http-auth.guard';
import { AuthServiceClient } from '../services/auth.service';
import { User } from '../types/user.interface';
import { LoginPayload } from '../types/login-payload.type';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthServiceClient) {}

  //Auth
  @Get('/me')
  @UseGuards(HttpAuthGuard)
  async getMe(@Req() req: AuthenticatedRequest) {
    console.log('User /me:', req.user);
    return req.user;
  }
  
  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginPayload: LoginPayload, @Res({ passthrough: true }) res: Response) {
    const { accessToken } = await this.authService.login(loginPayload);
    console.log('Login token:', accessToken);
    res.cookie('session', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // solo en HTTPS si es true
      sameSite: 'lax', // permite el envío de cookies en solicitudes de origen cruzado
      maxAge: 1000 * 60 * 60 * 1, // 1 hora
    });
    return { message: 'Login successful' };
  }

  @Post('/logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    console.log('Logging out...');
    res.clearCookie('session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { message: 'Logged out successfully' };
  }

}