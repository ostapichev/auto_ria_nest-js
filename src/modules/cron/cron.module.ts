import { Module } from '@nestjs/common';

import { CurrencyRateModule } from '../currency-rate/currency-rate.module';
import { LoggerModule } from '../logger/logger.module';
import { TasksService } from './services/cron.service';

@Module({
  imports: [CurrencyRateModule, LoggerModule],
  providers: [TasksService],
})
export class CronModule {}
