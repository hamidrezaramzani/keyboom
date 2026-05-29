import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid';
import { User } from './user.schema';
import { UsersRepository } from './user.repository';
import {
  UserChangePasswordPayloadDto,
  UserGetMeResponseOkDTO,
  UserLoginPayloadDto,
  UserRegisterPayloadDto,
  UserUpdateProfilePayloadDto,
} from '@keyboom/contracts/server';
import { JwtService } from '@nestjs/jwt';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { NotificationService } from '../notification/notification.service';
import { SanityCheckService } from '../sanity-check/sanity-check.service';
import { getFaMoment } from '../subscription/subscription.utils';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
    private readonly sanityCheckService: SanityCheckService,
  ) {}

  private generateId(): string {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 21);
    return nanoid();
  }
  private generateAccessToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
  }

  async getMe(userId: string): Promise<UserGetMeResponseOkDTO['data']> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      memberSince: getFaMoment(user.createdAt).format('YYYY/MM/DD'),
    };
  }

  async login(
    payload: UserLoginPayloadDto,
    {
      deviceInfo,
      ipAddress,
      loginTime,
    }: {
      deviceInfo: string;
      ipAddress?: string;
      loginTime: string;
    },
  ) {
    const user = await this.usersRepository.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      payload.password.trim(),
      user.password.trim(),
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user.id);

    await this.notificationService.create({
      title: 'ورود به حساب',
      message: `ورود جدید به حساب کاربری شما \n  زمان: ${loginTime} \n دستگاه: ${deviceInfo} \n آدرس IP: ${ipAddress}`,
      id: this.generateId(),
      userId: user.id,
      type: 'system',
    });

    return {
      id: user.id,
      accessToken: accessToken,
    };
  }

  async create(createUserDto: UserRegisterPayloadDto): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.usersRepository.create({
      id: this.generateId(),
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      password: hashedPassword,
      isActive: true,
    });

    await this.workspaceRepository.initiateWorkspaceForUser(
      newUser.id,
      newUser.fullName,
    );

    return newUser;
  }

  async updateProfile(userId: string, body: UserUpdateProfilePayloadDto) {
    const updatedUser = await this.usersRepository.update(userId, {
      fullName: body.fullName,
    });

    return {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
    };
  }

  async changePassword(userId: string, body: UserChangePasswordPayloadDto) {
    const user = await this.sanityCheckService.checkUserIsExists(userId);

    const isPasswordValid = await bcrypt.compare(
      body.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException({ passwordIsInvalid: true });
    }

    const hashedPassword = await bcrypt.hash(body.newPassword, 10);

    await this.usersRepository.update(userId, {
      password: hashedPassword,
    });

    return { success: true };
  }
}
