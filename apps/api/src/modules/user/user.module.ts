import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { UsersRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { WorkspaceModule } from '../workspace/workspace.module';
import { NotificationModule } from '../notification/notification.module';
import { SanityCheckModule } from '../sanity-check/sanity-check.module';

@Module({
  imports: [
    JwtModule,
    forwardRef(() => WorkspaceModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => SanityCheckModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
