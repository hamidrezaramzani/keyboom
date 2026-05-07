import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Body,
  Post,
  Patch,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import {
  WorkspaceCreatePayloadDto,
  WorkspaceCreateResponseOkDto,
  WorkspaceDeleteParamsDto,
  WorkspaceDeleteResponseOkDto,
  WorkspaceLeaveParamsDto,
  WorkspaceLeaveResponseOkDto,
  WorkspaceReadManyResponseOkDto,
  WorkspaceUpdateCurrentPayloadDto,
  WorkspaceUpdateCurrentResponseOkDto,
  WorkspaceUpdateSettingParamsDto,
  WorkspaceUpdateSettingPayloadDto,
  WorkspaceUpdateSettingResponseOkDto,
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

  @Put('/update-settings/:workspaceId')
  @HttpCode(HttpStatus.OK)
  async updateWorkspaceSettings(
    @UserId() userId: string,
    @Body() body: WorkspaceUpdateSettingPayloadDto,
    @Param() params: WorkspaceUpdateSettingParamsDto,
  ): Promise<WorkspaceUpdateSettingResponseOkDto> {
    const workspace = await this.workspaceService.updateWorkspaceSetting(
      userId,
      params.workspaceId,
      body,
    );

    return {
      data: workspace,
      message: 'Current workspace settings updated successfully',
      statusCode: 200,
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

  @Get(':workspaceId/members')
  @HttpCode(HttpStatus.OK)
  async getWorkspaceMembers(
    @Param('workspaceId') workspaceId: string,
    @UserId() userId: string,
  ) {
    const members = await this.workspaceService.getWorkspaceMembers(
      userId,
      workspaceId,
    );
    return { data: members, message: 'Workspace members', statusCode: 200 };
  }

  @Delete(':workspaceId/leave')
  @HttpCode(HttpStatus.OK)
  async leaveWorkspace(
    @UserId() userId: string,
    @Param() params: WorkspaceLeaveParamsDto,
  ): Promise<WorkspaceLeaveResponseOkDto> {
    await this.workspaceService.leaveWorkspace(userId, params.workspaceId);
    return {
      data: { success: true },
      message: 'Left workspace successfully',
      statusCode: 200,
    };
  }

  @Delete(':workspaceId')
  @HttpCode(HttpStatus.OK)
  async deleteWorkspace(
    @UserId() userId: string,
    @Param() params: WorkspaceDeleteParamsDto,
  ): Promise<WorkspaceDeleteResponseOkDto> {
    await this.workspaceService.deleteWorkspace(userId, params.workspaceId);
    return {
      data: { success: true },
      message: 'Workspace deleted successfully',
      statusCode: 200,
    };
  }
}
