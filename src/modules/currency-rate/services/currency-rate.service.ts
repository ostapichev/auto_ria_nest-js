import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment-timezone';
import { lastValueFrom } from 'rxjs';
import { Between } from 'typeorm';

import { Config, PrivateBankConfig, TimeZoneConfig } from '../../../config/config.type';
import { CurrencyRateEntity } from '../../../database/entities/currency-rate.entity';
import { CurrencyRateRepository } from '../../repository/services/currency-rate.repository';

@Injectable()
export class CurrencyRateService {
  constructor(
    private readonly httpService: HttpService,
    private readonly currencyRateRepository: CurrencyRateRepository,
    private configService: ConfigService<Config>,
  ) {}

  @Cron('0 0 * * *', {
    timeZone: 'Europe/Kyiv'
  })
  public async getExchangeRate(): Promise<CurrencyRateEntity[]> {
    const config = this.configService.get<PrivateBankConfig>('apiPrivate');
    const getRatesToday = await this.getCurrencyRate();
    if (getRatesToday.length > 0) {
      return getRatesToday;
    }
    const response = this.httpService.get(config.url);
    const result = await lastValueFrom(response);
    if (!response) {
      throw new BadRequestException('No response from server!');
    }
    const currenciesRate = result.data.map(
      (currency: CurrencyRateEntity) => {
        const entity = new CurrencyRateEntity();
        entity.ccy = currency.ccy;
        entity.base_ccy = currency.base_ccy;
        entity.sale = currency.sale;
        entity.buy = currency.buy;
        return entity;
      },
    );
    await this.currencyRateRepository.save(currenciesRate);
    return result.data;
  }

  private async getCurrencyRate(): Promise<CurrencyRateEntity[]> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const config = this.configService.get<TimeZoneConfig>('timeZone');
    const localDateStart = moment
      .tz(startOfDay, 'UTC')
      .tz(config.timeZone)
      .toDate();
    const localDateEnd = moment.tz(endOfDay, 'UTC').tz(config.timeZone).toDate();
    return await this.currencyRateRepository.find({
      where: {
        created: Between(localDateStart, localDateEnd),
      },
    });
  }
}
