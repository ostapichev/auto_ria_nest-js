import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrencyRateEntity } from '../../database/entities';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { CurrencyRateService } from './services/currency-rate.service';

@ApiTags('Currency Course')
@Controller('currency-course')
export class CurrencyRateController {
  constructor(private readonly currencyCourseService: CurrencyRateService) {}

  @ApiOperation({ description: 'Get currencies rate' })
  @SkipAuth()
  @Get()
  public async getCurrencyRate(): Promise<CurrencyRateEntity[]> {
    return await this.currencyCourseService.getExchangeRate();
  }
}
