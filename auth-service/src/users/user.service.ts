import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserPayload } from './types/create-user';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(userData: CreateUserPayload): Promise<UserDocument | undefined> {
      let seed : string = '';
      const oneFirstName = userData.firstName.split(' ')[0];
        seed = oneFirstName;
      if(userData.lastName) {
        const oneLastName = userData.lastName.split(' ')[0];
        seed += '%20' + oneLastName;
      }
      const hashedPassword = bcrypt.hashSync(userData.password, 10);
      const newUser = new this.userModel({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`,
        role: userData.role
      });
      return newUser.save();
    }
    async findById(id: string): Promise<UserDocument | null> {
      return this.userModel.findById(id).exec();
    }
    async findByEmail(email: string): Promise<UserDocument | null> {
      return this.userModel.findOne({ email }).exec();
    }
  
}