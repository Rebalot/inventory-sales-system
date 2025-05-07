import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/user.service';
import { UserDocument } from '../users/schemas/user.schema';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(userData: UserDocument): Promise<{ access_token: string }> {
    const payload = {
      sub: userData._id,
      email: userData.email,
      role: userData.role,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }

  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  async validateToken(token: string): Promise<UserDocument> {
    try {
      const decoded = this.jwtService.verify(token);

      const user = await this.usersService.findById(decoded.sub);
      if (!user) throw new RpcException('Unauthorized');

      return user;
    } catch (err) {
      throw new RpcException('Invalid or expired token');
    }
  }
}