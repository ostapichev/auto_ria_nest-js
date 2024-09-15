import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { CurrencyEnum } from '../../enums/currency.enum';

export class BaseCurrencyCourseReqDto {
  @ApiProperty({ example: 'USD' })
  @IsEnum(CurrencyEnum)
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toUpperCase)
  currency: CurrencyEnum;
}
