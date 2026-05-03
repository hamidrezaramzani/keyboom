import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { UsersRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [JwtModule, WorkspaceModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
