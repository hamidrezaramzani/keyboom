import {
  Controller,
  Post,
  Put,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { UserId } from 'src/core/decorators';
import {
  SubscriptionCreatePayloadDto,
  SubscriptionCreateResponseOkDto,
  SubscriptionUpdateParamsDto,
  SubscriptionUpdatePayloadDto,
  SubscriptionUpdateResponseOkDto,
  SubscriptionMoveParamsDto,
  SubscriptionMovePayloadDto,
  SubscriptionMoveResponseOkDto,
  SubscriptionRenewParamsDto,
  SubscriptionRenewPayloadDto,
  SubscriptionRenewResponseOkDto,
  SubscriptionCancelParamsDto,
  SubscriptionCancelPayloadDto,
  SubscriptionCancelResponseOkDto,
  SubscriptionGetStatsParamsDto,
  SubscriptionGetStatsResponseOkDto,
  SubscriptionGetReportParamsDto,
  SubscriptionGetReportResponseOkDto,
} from '@keyboom/contracts/server';
import { SubscriptionService } from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UserId() userId: string,
    @Body() body: SubscriptionCreatePayloadDto,
  ): Promise<SubscriptionCreateResponseOkDto> {
    const subscription = await this.subscriptionService.create(userId, body);
    return {
      data: subscription,
      message: 'Subscription created successfully',
      statusCode: 201,
    };
  }

  @Put(':subscriptionId')
  @HttpCode(HttpStatus.OK)
  async update(
    @UserId() userId: string,
    @Param() params: SubscriptionUpdateParamsDto,
    @Body() body: SubscriptionUpdatePayloadDto,
  ): Promise<SubscriptionUpdateResponseOkDto> {
    const subscription = await this.subscriptionService.update(
      userId,
      params.subscriptionId,
      body,
    );
    return {
      data: subscription,
      message: 'Subscription updated successfully',
      statusCode: 200,
    };
  }

  @Patch(':subscriptionId/move')
  @HttpCode(HttpStatus.OK)
  async move(
    @UserId() userId: string,
    @Param() params: SubscriptionMoveParamsDto,
    @Body() body: SubscriptionMovePayloadDto,
  ): Promise<SubscriptionMoveResponseOkDto> {
    await this.subscriptionService.move(
      userId,
      params.subscriptionId,
      body.groupId,
    );
    return {
      data: { success: true },
      message: 'Subscription moved successfully',
      statusCode: 200,
    };
  }

  @Post(':subscriptionId/renew')
  @HttpCode(HttpStatus.CREATED)
  async renew(
    @UserId() userId: string,
    @Param() params: SubscriptionRenewParamsDto,
    @Body() body: SubscriptionRenewPayloadDto,
  ): Promise<SubscriptionRenewResponseOkDto> {
    const subscription = await this.subscriptionService.renew(
      userId,
      params.subscriptionId,
      body.title,
      new Date(body.renewDate),
    );
    return {
      data: subscription,
      message: 'Subscription renewed successfully',
      statusCode: 201,
    };
  }

  @Post(':subscriptionId/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(
    @UserId() userId: string,
    @Param() params: SubscriptionCancelParamsDto,
    @Body() body: SubscriptionCancelPayloadDto,
  ): Promise<SubscriptionCancelResponseOkDto> {
    const subscription = await this.subscriptionService.cancel(
      userId,
      params.subscriptionId,
      body.title,
    );
    return {
      data: subscription,
      message: 'Subscription cancelled successfully',
      statusCode: 200,
    };
  }

  @Get(':subscriptionId/stats')
  @HttpCode(HttpStatus.OK)
  async getStats(
    @UserId() userId: string,
    @Param() params: SubscriptionGetStatsParamsDto,
  ): Promise<SubscriptionGetStatsResponseOkDto> {
    const stats = await this.subscriptionService.getStats(
      userId,
      params.subscriptionId,
    );
    return {
      data: stats,
      message: 'Subscription stats retrieved',
      statusCode: 200,
    };
  }

  @Get(':subscriptionId/report')
  @HttpCode(HttpStatus.OK)
  async getReport(
    @UserId() userId: string,
    @Param() params: SubscriptionGetReportParamsDto,
  ): Promise<SubscriptionGetReportResponseOkDto> {
    const report = await this.subscriptionService.getReport(
      userId,
      params.subscriptionId,
    );

    return {
      data: report,
      message: 'Report retrieved successfully',
      statusCode: 200,
    };
  }
}
