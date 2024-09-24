import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { TransformHelper } from '../../../../common';

export class BaseMessageReqDto {
  @ApiProperty({ example: 'Text message' })
  @IsString()
  @Length(2, 100)
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @Type(() => String)
  content: string;
}
