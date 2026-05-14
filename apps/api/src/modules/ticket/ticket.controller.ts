import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserId } from 'src/core/decorators';
import {
  TicketCreatePayloadDto,
  TicketCreateResponseOkDto,
  TicketReadManyQueryDto,
  TicketReadManyResponseOkDto,
  TicketReadOneParamsDto,
  TicketReadOneResponseOkDto,
  TicketAddMessageParamsDto,
  TicketAddMessagePayloadDto,
  TicketAddMessageResponseOkDto,
  TicketCloseParamsDto,
  TicketCloseResponseOkDto,
} from '@keyboom/contracts/server';
import { TicketService } from './ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UserId() userId: string,
    @Body() body: TicketCreatePayloadDto,
  ): Promise<TicketCreateResponseOkDto> {
    const ticket = await this.ticketService.create(userId, body);
    return {
      data: ticket,
      message: 'Ticket created successfully',
      statusCode: 201,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async readMany(
    @UserId() userId: string,
    @Query() query: TicketReadManyQueryDto,
  ): Promise<TicketReadManyResponseOkDto> {
    const tickets = await this.ticketService.readMany(userId, query);
    return {
      data: tickets,
      message: 'Tickets list',
      statusCode: 200,
    };
  }

  @Get(':ticketId')
  @HttpCode(HttpStatus.OK)
  async readOne(
    @UserId() userId: string,
    @Param() params: TicketReadOneParamsDto,
  ): Promise<TicketReadOneResponseOkDto> {
    const ticket = await this.ticketService.readOne(userId, params.ticketId);
    return {
      data: ticket,
      message: 'Ticket details',
      statusCode: 200,
    };
  }

  @Post(':ticketId/messages')
  @HttpCode(HttpStatus.CREATED)
  async addMessage(
    @UserId() userId: string,
    @Param() params: TicketAddMessageParamsDto,
    @Body() body: TicketAddMessagePayloadDto,
  ): Promise<TicketAddMessageResponseOkDto> {
    const message = await this.ticketService.addMessage(
      userId,
      params.ticketId,
      body.message,
    );
    return {
      data: message,
      message: 'Message added successfully',
      statusCode: 201,
    };
  }

  @Put(':ticketId/close')
  @HttpCode(HttpStatus.OK)
  async close(
    @UserId() userId: string,
    @Param() params: TicketCloseParamsDto,
  ): Promise<TicketCloseResponseOkDto> {
    await this.ticketService.close(userId, params.ticketId);
    return {
      data: { success: true },
      message: 'Ticket closed successfully',
      statusCode: 200,
    };
  }
}
