import { ApiProperty } from '@nestjs/swagger';

import { CurrencyEnum } from '../../enums/currency.enum';

export class BaseCurrencyCourseResDto {
  @ApiProperty({
    example: CurrencyEnum.EUR,
  })
  ccy: string;

  @ApiProperty({
    example: CurrencyEnum.UAH,
  })
  base_ccy: string;

  @ApiProperty({
    example: '44.90000',
  })
  buy: string;

  @ApiProperty({
    example: '41.45000',
  })
  sale: string;
}
