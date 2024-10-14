import { ApiProperty } from '@nestjs/swagger';

import { CurrencyEnum } from '../../../../database/enums';

export class BaseCurrencyRateResDto {
  @ApiProperty({
    example: 'f1ba3093-e0bd-478f-a104-33e13d6257b4',
  })
  id: string;

  @ApiProperty({
    example: CurrencyEnum.EUR,
  })
  ccy: CurrencyEnum;

  @ApiProperty({
    example: CurrencyEnum.UAH,
  })
  base_ccy: CurrencyEnum;

  @ApiProperty({
    example: '44.60000',
  })
  buy: string;

  @ApiProperty({
    example: '45.60000',
  })
  sale: string;
}
