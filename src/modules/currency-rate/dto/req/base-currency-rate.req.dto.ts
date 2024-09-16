import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, Max, Min } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { CurrencyEnum } from '../../enums/currency.enum';

export class BaseCurrencyRateReqDto {
  @ApiProperty({ example: 'USD' })
  @IsEnum(CurrencyEnum)
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toUpperCase)
  ccy: CurrencyEnum;

  @ApiProperty({ example: 'UAH' })
  @IsEnum(CurrencyEnum)
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toUpperCase)
  base_ccy: CurrencyEnum;

  @ApiProperty({ example: 20000 })
  @IsNumber()
  @Min(0)
  @Max(1000000000)
  @Type(() => Number)
  buy: number;

  @ApiProperty({ example: 20000 })
  @IsNumber()
  @Min(1)
  @Max(100000000)
  @Type(() => Number)
  sale: number;
}
