import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrencyRateEntity } from '../../database/entities/currency-rate.entity';

import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { CurrencyRateService } from './services/currency-rate.service';

@ApiTags('Currency Course')
@Controller('currency-course')
export class CurrencyRateController {
  constructor(private readonly currencyCourseService: CurrencyRateService) {}

  @SkipAuth()
  @Get()
  public async getCurrencyRate(): Promise<CurrencyRateEntity[]> {
    return await this.currencyCourseService.getExchangeRate();
  }
}
