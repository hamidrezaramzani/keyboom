import { Controller, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { WorkspaceReadManyResponseOkDto } from '@keyboom/contracts/server';
import { UserId } from 'src/core/decorators';
import { WorkspaceService } from './workspace.service';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async readMany(
    @UserId() userId: string,
  ): Promise<WorkspaceReadManyResponseOkDto> {
    const workspaces = await this.workspaceService.readMany(userId);
    return { data: workspaces, message: 'Workspaces list', statusCode: 200 };
  }
}
