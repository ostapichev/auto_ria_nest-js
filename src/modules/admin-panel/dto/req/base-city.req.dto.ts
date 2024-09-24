import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { TransformHelper } from '../../../../common';

export class BaseCityReqDto {
  @ApiProperty({ example: 'Kharkiv' })
  @IsString()
  @Length(2, 20)
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @Type(() => String)
  name: string;
}
