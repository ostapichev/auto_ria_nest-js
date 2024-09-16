import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CurrencyRateController } from './currency-rate.controller';
import { CurrencyRateService } from './services/currency-rate.service';

@Module({
  imports: [HttpModule],
  controllers: [CurrencyRateController],
  providers: [CurrencyRateService],
  exports: [CurrencyRateService],
})
export class CurrencyRateModule {}
