import {
  Injectable,
  ConflictException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid';
import { User } from './user.schema';
import { DRIZZLE } from 'src/core/db/drizzle.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UsersRepository } from './user.repository';
import {
  UserLoginPayloadDto,
  UserRegisterPayloadDto,
} from '@keyboom/contracts/server';
import { JwtService } from '@nestjs/jwt';
import { WorkspaceRepository } from '../workspace/workspace.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase,
    private readonly usersRepository: UsersRepository,
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly jwtService: JwtService,
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

  async login(payload: UserLoginPayloadDto) {
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
}
