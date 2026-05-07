import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupRepository } from './group.repository';
import { GroupService } from './group.service';
import { SanityCheckModule } from '../sanity-check/sanity-check.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [SanityCheckModule, WorkspaceModule],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository],
  exports: [GroupService, GroupRepository],
})
export class GroupModule {}
