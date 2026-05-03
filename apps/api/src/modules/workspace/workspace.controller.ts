import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Body,
  Post,
  Patch,
} from '@nestjs/common';
import {
  WorkspaceCreatePayloadDto,
  WorkspaceCreateResponseOkDto,
  WorkspaceReadManyResponseOkDto,
  WorkspaceUpdateCurrentPayloadDto,
  WorkspaceUpdateCurrentResponseOkDto,
} from '@keyboom/contracts/server';
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

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UserId() userId: string,
    @Body() body: WorkspaceCreatePayloadDto,
  ): Promise<WorkspaceCreateResponseOkDto> {
    const workspace = await this.workspaceService.create(userId, body.name);
    return {
      data: workspace,
      message: 'Workspace created successfully',
      statusCode: 201,
    };
  }

  @Patch('/current')
  @HttpCode(HttpStatus.OK)
  async updateCurrentWorkspace(
    @UserId() userId: string,
    @Body() body: WorkspaceUpdateCurrentPayloadDto,
  ): Promise<WorkspaceUpdateCurrentResponseOkDto> {
    const workspace = await this.workspaceService.updateCurrentWorkspace(
      userId,
      body.workspaceId,
    );

    return {
      data: workspace,
      message: 'Current workspace updated successfully',
      statusCode: 200,
    };
  }
}
