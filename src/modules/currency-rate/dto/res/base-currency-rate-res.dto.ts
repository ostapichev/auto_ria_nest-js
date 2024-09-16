import { ApiProperty } from '@nestjs/swagger';

import { CurrencyEnum } from '../../enums/currency.enum';

export class BaseCurrencyRateResDto {
  @ApiProperty({
    example: CurrencyEnum.EUR,
  })
  ccy: CurrencyEnum;

  @ApiProperty({
    example: CurrencyEnum.UAH,
  })
  base_ccy: CurrencyEnum;

  @ApiProperty({
    example: '44.90000',
  })
  buy: string;

  @ApiProperty({
    example: '41.45000',
  })
  sale: string;
}
