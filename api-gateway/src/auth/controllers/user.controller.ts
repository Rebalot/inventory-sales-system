import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../services/user.service';


@Controller('api/auth')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // User
    @Post('/create-user')
    @HttpCode(200)
    async createUser(@Body() userData: CreateUserDto) {
        const user = await this.userService.createUser(userData);
        return {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        ...(user.lastName && { lastName: user.lastName }),
        avatar: user.avatar,
        role: user.role,
        };
    }
}