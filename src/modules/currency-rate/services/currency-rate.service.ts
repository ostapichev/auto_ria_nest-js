import { HttpService } from '@nestjs/axios';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { AxiosResponse } from 'axios';
import * as moment from 'moment-timezone';
import { lastValueFrom } from 'rxjs';
import { Between } from 'typeorm';

import { Config, PrivateBankConfig } from '../../../config/config.type';
import { CurrencyRateEntity } from '../../../database/entities/currency-rate.entity';
import { CurrencyRateRepository } from '../../repository/services/currency-rate.repository';
import { BaseCurrencyRateReqDto } from '../dto/req/base-currency-rate.req.dto';
import { BaseCurrencyRateResDto } from '../dto/res/base-currency-rate-res.dto';

@Injectable()
export class CurrencyRateService {
  constructor(
    private readonly httpService: HttpService,
    private readonly currencyRateRepository: CurrencyRateRepository,
    private configService: ConfigService<Config>,
  ) {}

  public async getExchangeRate(): Promise<
    AxiosResponse<BaseCurrencyRateResDto[]>
  > {
    const config = this.configService.get<PrivateBankConfig>('apiPrivate');
    const getRatesToday = await this.getCurrencyRate();
    if (getRatesToday.length > 0) {
      throw new ConflictException('The request was completed today!');
    }
    const response = this.httpService.get(config.url);
    const result = await lastValueFrom(response);
    if (!response) {
      throw new BadRequestException('No response from server!');
    }
    const currenciesRate = result.data.map(
      (currency: BaseCurrencyRateReqDto) => {
        const entity = new CurrencyRateEntity();
        entity.ccy = currency.ccy;
        entity.base_ccy = currency.base_ccy;
        entity.sale = currency.sale;
        entity.buy = currency.buy;
        return entity;
      },
    );
    await this.currencyRateRepository.save(currenciesRate);
    return result;
  }

  public async getCurrencyRate(): Promise<CurrencyRateEntity[]> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const localDateStart = moment
      .tz(startOfDay, 'UTC')
      .tz('Europe/Kyiv')
      .toDate();
    const localDateEnd = moment.tz(endOfDay, 'UTC').tz('Europe/Kyiv').toDate();
    return await this.currencyRateRepository.find({
      where: {
        created: Between(localDateStart, localDateEnd),
      },
    });
  }
}
