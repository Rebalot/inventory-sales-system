import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus, Res, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserResponseDto } from '../dtos/user-response.dto';

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  avatar: string;
  role: string;
}
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req: AuthenticatedRequest): UserResponseDto {
    const user = req.user; // Viene del token validado por AuthGuard
    console.log('Usuario autenticado:', user); // Agregado para depuración
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      ...(user.lastName && { lastName: user.lastName }),
      avatar: user.avatar,
      role: user.role
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Res({ passthrough: true }) res: Response, @Body() loginDto: LoginDto): Promise<UserResponseDto> {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    console.log('Usuario validado:', user); // Agregado para depuración
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const { access_token: accessToken } = await this.authService.login(user);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // solo en HTTPS si es true
      sameSite: 'lax', // permite el envío de cookies en solicitudes de origen cruzado
      maxAge: 1000 * 60 * 60 * 1, // 1 hora
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      ...(user.lastName && { lastName: user.lastName }),
      avatar: user.avatar,
      role: user.role
    };
  }
  
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { message: 'Logged out successfully' };
  }
}
