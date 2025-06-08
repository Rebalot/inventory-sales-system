import { Controller, UseFilters } from "@nestjs/common";
import { UserService } from "../user.service";
import { GrpcMethod, RpcException } from "@nestjs/microservices";
import { MongoExceptionFilter } from "../filters/mongo-exception.filter";
import { status } from "@grpc/grpc-js";
import { UserResponse, UserPayload } from "../types/user.interface";

@Controller()
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'Create')
  @UseFilters(MongoExceptionFilter)
  async create(userData: UserPayload): Promise<UserResponse> {
    const user = await this.userService.createUser(userData);
    if (!user) {
      throw new RpcException({code: status.INTERNAL, message: 'User creation failed'});
    }
    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
    };
  }

  @GrpcMethod('UserService', 'FindByEmail')
  async findByEmail({ email }: { email: string }): Promise<UserResponse> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new RpcException({code: status.NOT_FOUND, message: 'User not found'});
    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
    };
  }

  @GrpcMethod('UserService', 'FindById')
  async findById({ id }: { id: string }): Promise<UserResponse> {
    const user = await this.userService.findById(id);
    if (!user) throw new RpcException({code: status.NOT_FOUND, message: 'User not found'});
    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
    };
  }
}