// apps/api/src/modules/invitation/invitation.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InvitationRepository } from './invite.repository';
import { WorkspaceRepository } from '../workspace/workspace.repository';
import { UsersRepository } from '../user/user.repository';
import { NotificationService } from '../notification/notification.service';
import { customAlphabet } from 'nanoid';

@Injectable()
export class InvitationService {
  constructor(
    private readonly invitationRepo: InvitationRepository,
    private readonly workspaceRepo: WorkspaceRepository,
    private readonly userRepo: UsersRepository,
    private readonly notificationService: NotificationService,
  ) {}

  private generateId(): string {
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 21);
    return nanoid();
  }

  async createInvitation(
    inviterId: string,
    workspaceId: string,
    inviteeEmail: string,
    role: 'admin' | 'member',
  ) {
    const user = await this.userRepo.findByEmail(inviteeEmail);
    if (!user) {
      return {
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User is not found',
        },
      };
    }

    const workspace = await this.workspaceRepo.findWorkspaceById(workspaceId);
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const inviterRole = await this.workspaceRepo.getUserRoleInWorkspace(
      inviterId,
      workspaceId,
    );
    if (inviterRole !== 'owner' && inviterRole !== 'admin') {
      throw new ForbiddenException(
        'You do not have permission to invite members',
      );
    }

    const isMember = await this.workspaceRepo.isUserMemberOfWorkspaceByEmail(
      inviteeEmail,
      workspaceId,
    );

    if (isMember) {
      return {
        error: {
          code: 'ALREADY_IN_WORKSPACE',
          message: 'User is already a member of this workspace',
        },
      };
    }

    const existingPending =
      await this.invitationRepo.findPendingByEmailAndWorkspace(
        inviteeEmail,
        workspaceId,
      );
    if (existingPending) {
      return {
        error: {
          code: 'ALREADY_INVITE',
          message: 'An invitation has already been sent to this email',
        },
      };
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await this.invitationRepo.create({
      workspaceId,
      inviterId,
      inviteeEmail,
      role,
      status: 'pending',
      expiresAt,
      id: this.generateId(),
    });

    const inviteeUser = await this.userRepo.findByEmail(inviteeEmail);
    const inviterUser = await this.userRepo.findById(inviterId);
    if (inviteeUser) {
      await this.notificationService.create({
        userId: inviteeUser.id,
        workspaceId,
        type: 'invitation',
        title: 'دعوت به فضای کاری',
        message: `${workspace.name}: شما توسط ${inviterUser?.fullName} به این فضای کاری دعوت شده‌اید`,
        metadata: JSON.stringify({ invitationId: invitation.id, role }),
        id: this.generateId(),
      });
    }

    return invitation;
  }

  async getWorkspaceInvitations(userId: string, workspaceId: string) {
    const userRole = await this.workspaceRepo.getUserRoleInWorkspace(
      userId,
      workspaceId,
    );
    if (userRole !== 'owner' && userRole !== 'admin') {
      throw new ForbiddenException(
        'You do not have permission to view invitations',
      );
    }

    return this.invitationRepo.findByWorkspaceId(workspaceId);
  }

  async getIncomingInvitations(email: string) {
    return this.invitationRepo.findPendingByEmail(email);
  }

  async respondToInvitation(
    userId: string,
    invitationId: string,
    accept: boolean,
  ) {
    const invitation = await this.invitationRepo.findById(invitationId);
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw new BadRequestException('Invitation has already been responded to');
    }

    if (invitation.expiresAt < new Date()) {
      await this.invitationRepo.updateStatus(invitationId, 'expired');
      throw new BadRequestException('Invitation has expired');
    }

    const user = await this.userRepo.findById(userId);
    if (!user || user.email !== invitation.inviteeEmail) {
      throw new ForbiddenException('This invitation is not for you');
    }

    if (accept) {
      await this.workspaceRepo.addMemberToWorkspace(
        userId,
        invitation.workspaceId,
        invitation.role as 'admin' | 'member',
      );

      await this.invitationRepo.updateStatus(invitationId, 'accepted');

      await this.notificationService.create({
        userId: invitation.inviterId,
        workspaceId: invitation.workspaceId,
        type: 'invitation_accepted',
        title: 'دعوت پذیرفته شد',
        message: `${user.fullName} دعوت شما را پذیرفت`,
        metadata: JSON.stringify({ userId, email: user.email }),
        id: this.generateId(),
      });
    } else {
      await this.invitationRepo.updateStatus(invitationId, 'rejected');

      await this.notificationService.create({
        userId: invitation.inviterId,
        workspaceId: invitation.workspaceId,
        type: 'invitation_rejected',
        title: 'دعوت رد شد',
        message: `${user.fullName} دعوت شما را رد کرد`,
        metadata: JSON.stringify({ userId, email: user.email }),
        id: this.generateId(),
      });
    }

    return invitation;
  }

  async getUserByUserId(userId: string) {
    return this.userRepo.findById(userId);
  }
}
