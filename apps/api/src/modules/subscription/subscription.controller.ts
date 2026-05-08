import {
  Controller,
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
  SubscriptionCreatePayloadDto,
  SubscriptionCreateResponseOkDto,
  SubscriptionUpdateParamsDto,
  SubscriptionUpdatePayloadDto,
  SubscriptionUpdateResponseOkDto,
  SubscriptionMoveParamsDto,
  SubscriptionMovePayloadDto,
  SubscriptionMoveResponseOkDto,
  SubscriptionDeleteParamsDto,
  SubscriptionDeleteResponseOkDto,
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

  @Delete(':subscriptionId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @UserId() userId: string,
    @Param() params: SubscriptionDeleteParamsDto,
  ): Promise<SubscriptionDeleteResponseOkDto> {
    await this.subscriptionService.delete(userId, params.subscriptionId);
    return {
      data: { success: true },
      message: 'Subscription deleted successfully',
      statusCode: 200,
    };
  }
}
