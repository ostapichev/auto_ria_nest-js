import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { lastValueFrom } from 'rxjs';
import { Between } from 'typeorm';

import { Config, PrivateBankConfig } from '../../../config';
import { CurrencyRateEntity } from '../../../database/entities';
import { CurrencyRateRepository } from '../../repository/services/currency-rate.repository';
import { BaseCurrencyRateResDto } from '../dto/res/base-currency-rate.dto';

@Injectable()
export class CurrencyRateService {
  constructor(
    private readonly httpService: HttpService,
    private readonly currencyRateRepository: CurrencyRateRepository,
    private readonly configService: ConfigService<Config>,
  ) {}

  public async getExchangeRate(): Promise<BaseCurrencyRateResDto[]> {
    const config = this.configService.get<PrivateBankConfig>('apiPrivate');
    const getRatesToday = await this.getCurrencyRate();
    if (getRatesToday.length) {
      return getRatesToday;
    }
    try {
      const response = this.httpService.get(config.url);
      const result = await lastValueFrom(response);
      const currenciesRate = result.data.map((currency: CurrencyRateEntity) => {
        const entity = new CurrencyRateEntity();
        entity.ccy = currency.ccy;
        entity.base_ccy = currency.base_ccy;
        entity.sale = currency.sale;
        entity.buy = currency.buy;
        return entity;
      });
      await this.currencyRateRepository.save(currenciesRate);
      return result.data;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  private async getCurrencyRate(): Promise<CurrencyRateEntity[]> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    return await this.currencyRateRepository.find({
      where: {
        created: Between(startOfDay, endOfDay),
      },
    });
  }
}
