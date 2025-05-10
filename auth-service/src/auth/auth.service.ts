import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/user.service';
import { UserDocument } from '../users/schemas/user.schema';
import { rpcError, RpcStatus } from 'src/common/exceptions/rpc-exception.util';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
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
      throw rpcError(RpcStatus.INTERNAL, 'Token generation failed');
    }
    return token;
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {	
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw rpcError(RpcStatus.UNAUTHENTICATED, 'Invalid credentials');
    }
    return user;
  }

  async validateToken(token: string): Promise<UserDocument> {
      const decoded = this.jwtService.verify(token);

      const user = await this.usersService.findById(decoded.sub);
      if (!user) throw rpcError(RpcStatus.UNAUTHENTICATED, 'Unauthorized');

      return user;
  }
}