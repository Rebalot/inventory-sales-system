import { Controller, UseFilters } from "@nestjs/common";
import { UserService } from "../user.service";
import { GrpcMethod } from "@nestjs/microservices";
import { MongoExceptionFilter } from "../filters/mongo-exception.filter";
import { rpcError } from "src/common/exceptions/rpc-exception.util";
import { status } from "@grpc/grpc-js";

@Controller()
export class UserGrpcController {
  constructor(private readonly usersService: UserService) {}

  @GrpcMethod('UsersService', 'Create')
  @UseFilters(MongoExceptionFilter)
  async create(userData: any): Promise<any> {
    const user = await this.usersService.create(userData);
    if (!user) {
      throw rpcError(status.INTERNAL, 'User creation failed');
    }
    return {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
    };
  }

  @GrpcMethod('UsersService', 'FindByEmail')
  async findByEmail({ email }: { email: string }): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw rpcError(status.NOT_FOUND, 'User not found');
    return {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
    };
  }

  @GrpcMethod('UsersService', 'FindById')
  async findById({ id }: { id: string }): Promise<any> {
    const user = await this.usersService.findById(id);
    if (!user) throw rpcError(status.NOT_FOUND, 'User not found');
    return {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
    };
  }
}