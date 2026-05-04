import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceModule } from '../workspace/workspace.module';
import { SanityCheckService } from './sanity-check.service';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [forwardRef(() => WorkspaceModule), forwardRef(() => UsersModule)],
  providers: [SanityCheckService],
  exports: [SanityCheckService],
})
export class SanityCheckModule {}
