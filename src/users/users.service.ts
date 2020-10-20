import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {hash} from 'bcrypt'
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/CreateUserDto';
import { saltRounds } from './constans';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = {...createUserDto, password: await hash(createUserDto.password, saltRounds)};
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findOne(email:string): Promise<User> {
    return this.userModel.findOne({email}).exec();
  }
}
