import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class CarViewReqDto {
  @ApiProperty({ example: '4258725c-3f5b-4bda-9ad5-3838192e9d87' })
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsUUID()
  @Type(() => String)
  carId: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  day?: number = 0;
}
