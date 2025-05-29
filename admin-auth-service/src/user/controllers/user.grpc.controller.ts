import { Controller, UseFilters } from "@nestjs/common";
import { UserService } from "../user.service";
import { GrpcMethod, RpcException } from "@nestjs/microservices";
import { MongoExceptionFilter } from "../filters/mongo-exception.filter";
import { status } from "@grpc/grpc-js";
import { User, UserPayload } from "../types/user.interface";

@Controller()
export class UserGrpcController {
  constructor(private readonly usersService: UserService) {}

  @GrpcMethod('UserService', 'Create')
  @UseFilters(MongoExceptionFilter)
  async create(userData: UserPayload): Promise<User> {
    const user = await this.usersService.createUser(userData);
    if (!user) {
      throw new RpcException({code: status.INTERNAL, message: 'User creation failed'});
    }
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
    };
  }

  @GrpcMethod('UserService', 'FindByEmail')
  async findByEmail({ email }: { email: string }): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new RpcException({code: status.NOT_FOUND, message: 'User not found'});
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
    };
  }

  @GrpcMethod('UsersService', 'FindById')
  async findById({ id }: { id: string }): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) throw new RpcException({code: status.NOT_FOUND, message: 'User not found'});
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
    };
  }
}