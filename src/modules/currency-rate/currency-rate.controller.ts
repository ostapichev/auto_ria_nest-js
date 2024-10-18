import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { BaseCurrencyRateResDto } from './dto/res/base-currency-rate.dto';
import { CurrencyMapper } from './mappers/currensy.mapper';
import { CurrencyRateService } from './services/currency-rate.service';

@ApiTags('Currency Course')
@Controller('currency-course')
export class CurrencyRateController {
  constructor(private readonly currencyCourseService: CurrencyRateService) {}

  @ApiOperation({ description: 'Get currencies rate' })
  @SkipAuth()
  @Get()
  public async getCurrencyRate(): Promise<BaseCurrencyRateResDto[]> {
    const entities = await this.currencyCourseService.getExchangeRate();
    return CurrencyMapper.toResponseListDTO(entities);
  }
}
