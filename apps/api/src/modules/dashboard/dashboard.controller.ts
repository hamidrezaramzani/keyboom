import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UserId } from 'src/core/decorators';
import {
  GetDashboardParamsDto,
  GetDashboardResponseOkDto,
} from '@keyboom/contracts/server';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get(':range')
  @HttpCode(HttpStatus.OK)
  async getDashboard(
    @UserId() userId: string,
    @Param() params: GetDashboardParamsDto,
  ): Promise<GetDashboardResponseOkDto> {
    const data = (await this.dashboardService.getDashboard(
      userId,
      params.range,
    )) as unknown as GetDashboardResponseOkDto['data'];

    return {
      data,
      message: 'Dashboard data retrieved successfully',
      statusCode: 200,
    };
  }
}
