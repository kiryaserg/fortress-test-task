import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  UseGuards,
  Request
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/CreateUserDto';
import { User } from './schemas/user.schema';
import { LocalAuthGuard } from './auth/local-auth.guard'
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserDto } from './dto/UserDto';
import { AccessTokenDto } from './dto/AccessTokenDto';
import { CredentialsDto } from './dto/CredentialsDto';

@Controller()
export class AppController {
  constructor(private readonly userService: UsersService, private authService: AuthService) {
  }

  @Post('signup')
  @ApiResponse({ status: 200, description: 'The record has been successfully created.', type: UserDto })
  @ApiResponse({ status: 400, description: 'Validation errors'})
  @ApiBody({ type: [CreateUserDto] })
  async signup(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const user: User = await this.userService.create(createUserDto);
      return <UserDto> {email: user.email, id: user._id as unknown as string}
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException()
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'User data.', type: UserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized'})
  @Get('me')
  me(@Request() req): UserDto {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: 200, description: '.', type: AccessTokenDto })
  @ApiResponse({ status: 401, description: 'Unauthorized'})
  @ApiBody({ type: [CredentialsDto] })
  @Post('signin')
  signin(@Request() req) {
    return this.authService.login(req.user);
  }
}
