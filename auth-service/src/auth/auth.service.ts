import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/schemas/user.schema';
import { rpcError } from 'src/common/exceptions/rpc-exception.util';
import { status } from '@grpc/grpc-js';


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
      throw rpcError(status.INTERNAL, 'Token generation failed');
    }
    return token;
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {	
    const user = await this.userService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw rpcError(status.UNAUTHENTICATED, 'Invalid credentials');
    }
    return user;
  }

  async validateToken(token: string): Promise<UserDocument> {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.findById(decoded.sub);
      if (!user) throw rpcError(status.UNAUTHENTICATED, 'Unauthorized');

      return user;
  }
}