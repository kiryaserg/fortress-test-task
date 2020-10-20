import { BadRequestException, Body, Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from '../dto/CreateUserDto';
import { UsersService } from '../users/users.service';

@Injectable()
export class UniqueUserMiddleware implements NestMiddleware {
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(private readonly userService: UsersService) {
  }

  async use(@Body() createUserDto: CreateUserDto, res: Response, next: Function) {
    const existingUser = await this.userService.findOne(createUserDto.email);
    if(existingUser) {
      throw new BadRequestException('The user with provided email already exist')
    }

    next();
  }
}
