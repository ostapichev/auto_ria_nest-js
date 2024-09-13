import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { BaseCurrencyCourseResDto } from './dto/res/base-currency-course.res.dto';
import { CurrencyCourseService } from './services/currency-course.service';

@ApiTags('Currency Course')
@Controller('currency-course')
export class CurrencyCourseController {
  constructor(private readonly currencyCourseService: CurrencyCourseService) {}

  @SkipAuth()
  @Get()
  public async getCurrencyCourse(): Promise<BaseCurrencyCourseResDto[]> {
    const exchangeRate = await this.currencyCourseService.getExchangeRate();
    return exchangeRate.data;
  }
}
