import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { BaseCurrencyRateResDto } from './dto/res/base-currency-rate-res.dto';
import { CurrencyRateService } from './services/currency-rate.service';

@ApiTags('Currency Course')
@Controller('currency-course')
export class CurrencyRateController {
  constructor(private readonly currencyCourseService: CurrencyRateService) {}

  @SkipAuth()
  @Get()
  public async getCurrencyRate(): Promise<BaseCurrencyRateResDto[]> {
    const exchangeRate = await this.currencyCourseService.getExchangeRate();
    return exchangeRate.data;
  }
}
