import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  Req,
  Put,
} from '@nestjs/common';
import { UsersService } from './user.service';
import {
  UserChangePasswordPayloadDto,
  UserChangePasswordResponseOkDto,
  UserGetMeResponseOkDTO,
  UserLoginPayloadDto,
  UserLoginResponseOkDto,
  UserRegisterPayloadDto,
  UserRegisterResponseOkDto,
  UserUpdateProfilePayloadDto,
  UserUpdateProfileResponseOkDto,
} from '@keyboom/contracts/server';
import type { Request, Response } from 'express';
import { Public, UserId } from 'src/core/decorators';
import moment from 'jalali-moment';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private accessTokenKey: string = 'ACCESS_TOKEN';

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async getMe(@UserId() userId: string): Promise<UserGetMeResponseOkDTO> {
    const me = await this.usersService.getMe(userId);
    return { data: me, message: 'My user', statusCode: 200 };
  }

  @Public()
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() payload: UserRegisterPayloadDto,
  ): Promise<UserRegisterResponseOkDto> {
    const createUser = await this.usersService.create(payload);
    return { data: createUser, message: 'User created', statusCode: 201 };
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: Request,
    @Body() payload: UserLoginPayloadDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserLoginResponseOkDto> {
    const userAgent = req.useragent;

    const deviceInfo = `${userAgent?.os} - ${userAgent?.browser} ${userAgent?.version}`;
    const ipAddress = req.ip;
    const loginTime = moment(new Date())
      .locale('fa')
      .format('YYYY/MM/DD HH:mm');

    const result = await this.usersService.login(payload, {
      deviceInfo,
      ipAddress,
      loginTime,
    });

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

  @Public()
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.accessTokenKey, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
    });

    return { message: 'Logout successful' };
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @UserId() userId: string,
    @Body() body: UserUpdateProfilePayloadDto,
  ): Promise<UserUpdateProfileResponseOkDto> {
    const data = await this.usersService.updateProfile(userId, body);
    return {
      data,
      message: 'Profile updated successfully',
      statusCode: 200,
    };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @UserId() userId: string,
    @Body() body: UserChangePasswordPayloadDto,
  ): Promise<UserChangePasswordResponseOkDto> {
    const data = await this.usersService.changePassword(userId, body);
    return {
      data,
      message: 'Password changed successfully',
      statusCode: 200,
    };
  }
}
