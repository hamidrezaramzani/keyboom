import { Module } from '@nestjs/common';
import { WorkspaceRepository } from './workspace.repository';

@Module({
  controllers: [],
  providers: [WorkspaceRepository],
  exports: [WorkspaceRepository],
})
export class WorkspaceModule {}
