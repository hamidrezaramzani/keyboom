import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Public, UserId } from 'src/core/decorators';
import {
  BaleGenerateCodeResponseOkDto,
  BaleVerifyCodePayloadDto,
  BaleVerifyCodeResponseOkDto,
  BaleGetStatusResponseOkDto,
  BaleDisconnectResponseOkDto,
  BaleConnectBalePayloadDto,
} from '@keyboom/contracts/server';
import { BaleService } from './bale.service';
import type { BaleMessage } from 'src/core/helpers/bale.helper';
import { BaleBotService } from './bale-bot.service';

@Controller('bale')
export class BaleController {
  constructor(
    private readonly baleService: BaleService,
    private readonly baleBotService: BaleBotService,
  ) {}

  @Post('generate-code')
  @HttpCode(HttpStatus.OK)
  generateCode(@UserId() userId: string): BaleGenerateCodeResponseOkDto {
    const data = this.baleService.generateCodeForUser(userId);
    return {
      data,
      message: 'Code generated successfully',
      statusCode: 200,
    };
  }

  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  verifyCode(
    @UserId() userId: string,
    @Body() body: BaleVerifyCodePayloadDto,
  ): BaleVerifyCodeResponseOkDto {
    const data = this.baleService.verifyCode(userId, body.code);
    return {
      data,
      message: 'Code verified successfully',
      statusCode: 200,
    };
  }

  @Post('connect')
  @HttpCode(HttpStatus.OK)
  async connectBale(
    @Body() body: BaleConnectBalePayloadDto,
  ): Promise<BaleVerifyCodeResponseOkDto> {
    const data = await this.baleService.connectBale(body.baleChatId, body.code);
    return {
      data,
      message: 'Connected successfully',
      statusCode: 200,
    };
  }

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getStatus(
    @UserId() userId: string,
  ): Promise<BaleGetStatusResponseOkDto> {
    const data = await this.baleService.getStatus(userId);
    return {
      data,
      message: 'Status retrieved successfully',
      statusCode: 200,
    };
  }

  @Delete('disconnect')
  @HttpCode(HttpStatus.OK)
  async disconnect(
    @UserId() userId: string,
  ): Promise<BaleDisconnectResponseOkDto> {
    const data = await this.baleService.disconnect(userId);
    return {
      data,
      message: 'Disconnected successfully',
      statusCode: 200,
    };
  }

  @Public()
  @Post('/webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() body: BaleMessage) {
    await this.baleBotService.processBaleRequest(body);
    return { message: 'Webhook post succesfully' };
  }
}
