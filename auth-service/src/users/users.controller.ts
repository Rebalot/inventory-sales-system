import { Controller, UseFilters } from "@nestjs/common";
import { UsersService } from "./user.service";
import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";
import { CreatedUser, CreateUserPayload } from "./types/create-user.types";
import { MongoExceptionFilter } from "./filters/mongo-exception.filter";

@Controller()
export class UsersController {
  constructor(
  private readonly usersService: UsersService,
  ) {}

  @MessagePattern('user.create')
  @UseFilters(MongoExceptionFilter)
  async create(@Payload() userData: CreateUserPayload): Promise<CreatedUser> {
    const user = await this.usersService.create(userData);
    if(!user) {
      throw new RpcException('Error creating user');
    }
    return {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      ...(user.lastName && { lastName: user.lastName }),
      avatar: user.avatar,
      role: user.role,
    }
  }
  @MessagePattern('user.findByEmail')
  async findByEmail(@Payload() email: string) {
    return this.usersService.findByEmail(email);
  }
  @MessagePattern('user.findById')
  async findById(@Payload() id: string) {
    return this.usersService.findById(id);
  }
}
