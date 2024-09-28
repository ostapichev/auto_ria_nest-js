import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

import { TransformHelper } from '../../../../common';

export class CarViewReqDto {
  @ApiProperty()
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsUUID()
  @Type(() => IsUUID)
  carId: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  day?: number = 0;
}
