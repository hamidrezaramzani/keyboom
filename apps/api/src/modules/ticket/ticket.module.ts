import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TicketRepository } from './ticket.repository';
import { UsersModule } from '../user/user.module';
import { SanityCheckModule } from '../sanity-check/sanity-check.module';

@Module({
  imports: [UsersModule, SanityCheckModule],
  controllers: [TicketController],
  providers: [TicketService, TicketRepository],
  exports: [TicketService, TicketRepository],
})
export class TicketModule {}
