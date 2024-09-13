import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';

import { Config, PrivateBankConfig } from '../../../config/config.type';
import { BaseCurrencyCourseResDto } from '../dto/res/base-currency-course.res.dto';

@Injectable()
export class CurrencyCourseService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService<Config>,
  ) {}

  public async getExchangeRate(): Promise<
    AxiosResponse<BaseCurrencyCourseResDto[]>
  > {
    const config = this.configService.get<PrivateBankConfig>('apiPrivate');
    const response = this.httpService.get(config.url);
    return await lastValueFrom(response);
  }
}
