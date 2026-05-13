import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserId } from 'src/core/decorators';
import {
  SubscriptionPeriodCreateParamsDto,
  SubscriptionPeriodCreatePayloadDto,
  SubscriptionPeriodCreateResponseOkDto,
  SubscriptionPeriodReadManyParamsDto,
  SubscriptionPeriodReadManyResponseOkDto,
  SubscriptionPeriodUpdateParamsDto,
  SubscriptionPeriodUpdatePayloadDto,
  SubscriptionPeriodUpdateResponseOkDto,
  SubscriptionPeriodDeleteParamsDto,
  SubscriptionPeriodDeleteResponseOkDto,
} from '@keyboom/contracts/server';
import { SubscriptionPeriodService } from './subscription-period.service';

@Controller('subscriptions/:subscriptionId/periods')
export class SubscriptionPeriodController {
  constructor(private readonly periodService: SubscriptionPeriodService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UserId() userId: string,
    @Param() params: SubscriptionPeriodCreateParamsDto,
    @Body() body: SubscriptionPeriodCreatePayloadDto,
  ): Promise<SubscriptionPeriodCreateResponseOkDto> {
    const period = await this.periodService.create(
      userId,
      params.subscriptionId,
      body,
    );
    return {
      data: period,
      message: 'Price period created successfully',
      statusCode: 201,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async readMany(
    @UserId() userId: string,
    @Param() params: SubscriptionPeriodReadManyParamsDto,
  ): Promise<SubscriptionPeriodReadManyResponseOkDto> {
    const periods = await this.periodService.readMany(
      userId,
      params.subscriptionId,
    );
    return {
      data: periods,
      message: 'Price periods list',
      statusCode: 200,
    };
  }

  @Put(':periodId')
  @HttpCode(HttpStatus.OK)
  async update(
    @UserId() userId: string,
    @Param() params: SubscriptionPeriodUpdateParamsDto,
    @Body() body: SubscriptionPeriodUpdatePayloadDto,
  ): Promise<SubscriptionPeriodUpdateResponseOkDto> {
    const period = await this.periodService.update(
      userId,
      params.periodId,
      body,
    );
    return {
      data: period,
      message: 'Price period updated successfully',
      statusCode: 200,
    };
  }

  @Delete(':periodId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @UserId() userId: string,
    @Param() params: SubscriptionPeriodDeleteParamsDto,
  ): Promise<SubscriptionPeriodDeleteResponseOkDto> {
    await this.periodService.delete(userId, params.periodId);
    return {
      data: { success: true },
      message: 'Price period deleted successfully',
      statusCode: 200,
    };
  }
}
