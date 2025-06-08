import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserServiceClient } from '../services/user.service';
import { HttpAuthGuard } from '../guards/http-auth.guard';


@Controller('api/auth')
export class UserController {
    constructor(private readonly userService: UserServiceClient) {}

    // User
    @Post('/create-user')
    // @UseGuards(HttpAuthGuard)
    async createUser(@Body() userData: CreateUserDto) {
        const user = await this.userService.createUser(userData);
        return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        ...(user.lastName && { lastName: user.lastName }),
        avatar: user.avatar,
        role: user.role,
        };
    }
}