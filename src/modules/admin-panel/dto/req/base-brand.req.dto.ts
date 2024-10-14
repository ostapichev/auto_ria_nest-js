import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { TransformHelper } from '../../../../common';

export class BaseBrandReqDto {
  @ApiProperty({ example: 'Audi' })
  @IsString()
  @Length(1, 20)
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @Type(() => String)
  name: string;
}
