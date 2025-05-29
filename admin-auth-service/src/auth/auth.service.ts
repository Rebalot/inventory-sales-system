import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/schemas/user.schema';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument): Promise<string> {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    if (!token) {
      throw new RpcException({code: status.INTERNAL, message: 'Token generation failed'});
    }
    return token;
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {	
    const user = await this.userService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new RpcException({code: status.UNAUTHENTICATED, message: 'Invalid credentials'});
    }
    return user;
  }

  async validateToken(token: string): Promise<UserDocument> {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.findById(decoded.sub);
      if (!user) throw new RpcException({code: status.UNAUTHENTICATED, message: 'Unauthorized'});

      return user;
  }
}