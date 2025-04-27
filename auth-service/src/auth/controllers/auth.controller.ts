import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus, Res, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
  }
}
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req: AuthenticatedRequest) {
    const user = req.user; // Viene del token validado por AuthGuard

    return {
      id: user['sub'],
      email: user['email'],
      role: user['role'],
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Res({ passthrough: true }) res: Response, @Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const { access_token: accessToken } = await this.authService.login(user);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true, // solo en HTTPS
      sameSite: 'strict', // evita CSRF
      maxAge: 1000 * 60 * 60 * 1, // 1 hora
    });

    return { message: 'Login successful' };
  }
}
