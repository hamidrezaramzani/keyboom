import { Module } from '@nestjs/common';
import { BaleController } from './bale.controller';
import { BaleService } from './bale.service';
import { UsersRepository } from '../user/user.repository';
import { BaleBotService } from './bale-bot.service';
import { BaleHelper } from 'src/core/helpers/bale.helper';

@Module({
  controllers: [BaleController],
  providers: [BaleService, UsersRepository, BaleBotService, BaleHelper],
  exports: [BaleService, BaleBotService],
})
export class BaleModule {}
