import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { TransformHelper } from '../../../../common';
import { CurrencyEnum } from '../../../currency-rate/enums/currency.enum';

export class CityCurrencyQueryDto {
  @ApiProperty()
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsUUID()
  @IsOptional()
  @Type(() => IsUUID)
  cityId?: string = null;

  @ApiProperty({ example: CurrencyEnum.USD })
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toUpperCase)
  @IsEnum(CurrencyEnum)
  @Type(() => IsEnum)
  currency: CurrencyEnum;
}
