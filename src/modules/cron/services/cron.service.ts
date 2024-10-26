import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { CurrencyRateService } from '../../currency-rate/services/currency-rate.service';
import { LoggerService } from '../../logger/services/logger.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly currencyRateService: CurrencyRateService,
    private readonly logger: LoggerService,
  ) {}

  @Cron('0 0 * * *')
  public async handleCron(): Promise<void> {
    try {
      await this.currencyRateService.getExchangeRate();
      this.logger.log('Currency rate updated');
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
