import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
} from '@nestjs/common';
import { UsersService } from './user.service';
import {
  UserGetMeResponseOkDTO,
  UserLoginPayloadDto,
  UserLoginResponseOkDto,
  UserRegisterPayloadDto,
  UserRegisterResponseOkDto,
} from '@keyboom/contracts/server';
import type { Response } from 'express';
import { UserId } from 'src/core/decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private accessTokenKey: string = 'ACCESS_TOKEN';

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async getMe(@UserId() userId: string): Promise<UserGetMeResponseOkDTO> {
    const me = await this.usersService.getMe(userId);
    return { data: me, message: 'User created', statusCode: 201 };
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() payload: UserRegisterPayloadDto,
  ): Promise<UserRegisterResponseOkDto> {
    const createUser = await this.usersService.create(payload);
    return { data: createUser, message: 'User created', statusCode: 201 };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() payload: UserLoginPayloadDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserLoginResponseOkDto> {
    const result = await this.usersService.login(payload);

    response.cookie(this.accessTokenKey, result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      data: { id: result.id },
      message: 'Login successful',
      statusCode: 200,
    };
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(this.accessTokenKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return {
      message: 'Login successful',
      statusCode: 200,
    };
  }
}
