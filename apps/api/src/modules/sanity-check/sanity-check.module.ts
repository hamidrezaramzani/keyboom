import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceModule } from '../workspace/workspace.module';
import { SanityCheckService } from './sanity-check.service';

@Module({
  imports: [forwardRef(() => WorkspaceModule)],
  providers: [SanityCheckService],
  exports: [SanityCheckService],
})
export class SanityCheckModule {}
