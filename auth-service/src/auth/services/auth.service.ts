import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { RegisterDto } from '../dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    let seed : string = '';
    const oneFirstName = registerDto.firstName.split(' ')[0];
      seed = oneFirstName;
    if(registerDto.lastName) {
      const oneLastName = registerDto.lastName.split(' ')[0];
      seed += '%20' + oneLastName;
    }
    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);
    const newUser = new this.userModel({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`,
      role: registerDto.role
    });
    return newUser.save();
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (user && bcrypt.compareSync(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}