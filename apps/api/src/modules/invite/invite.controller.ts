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
  RespondInvitationPayloadDto,
} from '@keyboom/contracts/server';

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
      body.role,
    );
    return { data: invitation, message: 'Invitation sent', statusCode: 200 };
  }

  @Get('workspace/:workspaceId')
  async getWorkspaceInvitations(
    @Req() req: Request,
    @Param('workspaceId') workspaceId: string,
  ) {
    const userId = req.userId!;
    const invitations = await this.invitationService.getWorkspaceInvitations(
      userId,
      workspaceId,
    );
    return { data: invitations, message: 'Invitations list', statusCode: 200 };
  }

  @Get('incoming')
  async getIncomingInvitations(@Req() req: Request) {
    const userId = req.userId!;
    const user = await this.invitationService.getUserByUserId(userId);
    const invitations = await this.invitationService.getIncomingInvitations(
      user?.email || '',
    );
    return {
      data: invitations,
      message: 'Incoming invitations',
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
