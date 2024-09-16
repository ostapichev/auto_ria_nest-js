import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { CurrencyEnum } from '../../../currency-rate/enums/currency.enum';

export class CityCurrencyQueryDto {
  @ApiProperty({ example: '4258725c-3f5b-4bda-9ad5-3838192e9d87' })
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsUUID()
  @IsOptional()
  cityId?: string = null;

  @ApiProperty({ example: 'USD' })
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toUpperCase)
  @IsEnum(CurrencyEnum)
  @Type(() => String)
  currency: CurrencyEnum;
}
