import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { InvitationService } from './invite.service';
import { AuthGuard } from '../../core/guards/auth.guard';
import {
  CreateInvitationPayloadDto,
  ReadManyInvitationsResponseOkDto,
  RespondInvitationPayloadDto,
} from '@keyboom/contracts/server';
import { UserId } from 'src/core/decorators';

@Controller('invitations')
@UseGuards(AuthGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: Request, @Body() body: CreateInvitationPayloadDto) {
    const userId = req.userId!;
    const invitation = await this.invitationService.createInvitation(
      userId,
      body.workspaceId,
      body.email,
    );
    return { data: invitation, message: 'Invitation sent', statusCode: 200 };
  }

  @Get('workspace/:workspaceId')
  async getWorkspaceInvitations(@Param('workspaceId') workspaceId: string) {
    const invitations =
      await this.invitationService.getWorkspaceInvitations(workspaceId);
    return { data: invitations, message: 'Invitations list', statusCode: 200 };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyInvites(
    @UserId() userId: string,
  ): Promise<ReadManyInvitationsResponseOkDto> {
    const invitations = await this.invitationService.getUserInvites(userId);

    return {
      data: invitations,
      message: 'Invitations list',
      statusCode: 200,
    };
  }

  @Post(':id/respond')
  @HttpCode(HttpStatus.OK)
  async respond(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: RespondInvitationPayloadDto,
  ) {
    const userId = req.userId!;
    const invitation = await this.invitationService.respondToInvitation(
      userId,
      id,
      body.accept,
    );
    return {
      data: invitation,
      message: 'Invitation responded',
      statusCode: 200,
    };
  }
}
