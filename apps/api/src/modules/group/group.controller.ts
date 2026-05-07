import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserId } from 'src/core/decorators';
import {
  GroupCreatePayloadDto,
  GroupCreateResponseOkDto,
  GroupReadManyParamsDto,
  GroupReadManyResponseOkDto,
  GroupUpdateParamsDto,
  GroupUpdatePayloadDto,
  GroupUpdateResponseOkDto,
  GroupReorderPayloadDto,
  GroupReorderResponseOkDto,
  GroupArchiveParamsDto,
  GroupArchiveResponseOkDto,
  GroupRestoreParamsDto,
  GroupRestoreResponseOkDto,
  GroupDeleteParamsDto,
  GroupDeleteResponseOkDto,
} from '@keyboom/contracts/server';
import { GroupService } from './group.service';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UserId() userId: string,
    @Body() body: GroupCreatePayloadDto,
  ): Promise<GroupCreateResponseOkDto> {
    const group = await this.groupService.create(userId, body.name);
    return {
      data: group,
      message: 'Group created successfully',
      statusCode: 201,
    };
  }

  @Get(':workspaceId')
  @HttpCode(HttpStatus.OK)
  async readMany(
    @UserId() userId: string,
    @Param() params: GroupReadManyParamsDto,
  ): Promise<GroupReadManyResponseOkDto> {
    const groups = await this.groupService.readMany(userId, params.workspaceId);
    return {
      data: groups,
      message: 'Groups list',
      statusCode: 200,
    };
  }

  @Put(':groupId')
  @HttpCode(HttpStatus.OK)
  async update(
    @UserId() userId: string,
    @Param() params: GroupUpdateParamsDto,
    @Body() body: GroupUpdatePayloadDto,
  ): Promise<GroupUpdateResponseOkDto> {
    const group = await this.groupService.update(userId, params.groupId, body);
    return {
      data: group,
      message: 'Group updated successfully',
      statusCode: 200,
    };
  }

  @Patch('reorder')
  @HttpCode(HttpStatus.OK)
  async reorder(
    @UserId() userId: string,
    @Body() body: GroupReorderPayloadDto,
  ): Promise<GroupReorderResponseOkDto> {
    await this.groupService.reorder(userId, body.groupIds);
    return {
      data: { success: true },
      message: 'Groups reordered successfully',
      statusCode: 200,
    };
  }

  @Patch(':groupId/archive')
  @HttpCode(HttpStatus.OK)
  async archive(
    @UserId() userId: string,
    @Param() params: GroupArchiveParamsDto,
  ): Promise<GroupArchiveResponseOkDto> {
    await this.groupService.archive(userId, params.groupId);
    return {
      data: { success: true },
      message: 'Group archived successfully',
      statusCode: 200,
    };
  }

  @Patch(':groupId/restore')
  @HttpCode(HttpStatus.OK)
  async restore(
    @UserId() userId: string,
    @Param() params: GroupRestoreParamsDto,
  ): Promise<GroupRestoreResponseOkDto> {
    await this.groupService.restore(userId, params.groupId);
    return {
      data: { success: true },
      message: 'Group restored successfully',
      statusCode: 200,
    };
  }

  @Delete(':groupId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @UserId() userId: string,
    @Param() params: GroupDeleteParamsDto,
  ): Promise<GroupDeleteResponseOkDto> {
    await this.groupService.delete(
      userId,
      params.groupId,
      params.moveToGroupId,
    );
    return {
      data: { success: true },
      message: 'Group deleted successfully',
      statusCode: 200,
    };
  }
}
