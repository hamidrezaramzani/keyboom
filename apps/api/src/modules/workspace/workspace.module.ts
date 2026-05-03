import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceRepository } from './workspace.repository';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [WorkspaceController],
  providers: [WorkspaceRepository, WorkspaceService],
  exports: [WorkspaceRepository],
})
export class WorkspaceModule {}
