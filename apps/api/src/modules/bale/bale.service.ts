import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersRepository } from '../user/user.repository';

interface TempCode {
  userId: string;
  expiresAt: Date;
}

@Injectable()
export class BaleService {
  private tempCodes: Map<string, TempCode> = new Map();

  constructor(private readonly userRepository: UsersRepository) {}

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateCodeForUser(userId: string) {
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    this.tempCodes.set(code, { userId, expiresAt });

    return {
      code,
      expiresAt: expiresAt.toISOString(),
    };
  }

  verifyCode(userId: string, code: string) {
    const tempData = this.tempCodes.get(code);

    if (!tempData) {
      throw new BadRequestException('کد نامعتبر است');
    }

    if (tempData.userId !== userId) {
      throw new BadRequestException('این کد برای شما صادر نشده است');
    }

    if (new Date() > tempData.expiresAt) {
      this.tempCodes.delete(code);
      throw new BadRequestException('کد منقضی شده است');
    }

    this.tempCodes.delete(code);

    return { success: true };
  }

  async getStatus(userId: string) {
    const user = await this.userRepository.findById(userId);

    return {
      isConnected: !!user?.baleChatId,
      baleChatId: user?.baleChatId || null,
    };
  }

  async disconnect(userId: string) {
    await this.userRepository.update(userId, {
      baleChatId: null,
      baleConnectedAt: null,
    });

    return { success: true };
  }

  async findUserByBaleChatId(baleChatId: string) {
    return this.userRepository.findByBaleChatId(baleChatId);
  }

  async getStatusByBaleChatId(baleChatId: string) {
    const user = await this.userRepository.findByBaleChatId(baleChatId);

    return {
      isConnected: !!user?.baleChatId,
      baleChatId: user?.baleChatId || null,
    };
  }

  async connectBale(baleChatId: string, code: string) {
    const tempData = this.tempCodes.get(code);

    if (!tempData) {
      throw new BadRequestException('کد نامعتبر است');
    }

    if (new Date() > tempData.expiresAt) {
      this.tempCodes.delete(code);
      throw new BadRequestException('کد منقضی شده است');
    }

    const userId = tempData.userId;

    await this.userRepository.update(userId, {
      baleChatId,
      baleConnectedAt: new Date(),
    });

    this.tempCodes.delete(code);

    return { success: true, message: 'اتصال با موفقیت انجام شد' };
  }
}
