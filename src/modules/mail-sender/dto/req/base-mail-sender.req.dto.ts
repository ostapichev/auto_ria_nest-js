import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

import { TransformHelper } from '../../../../common';

export class BaseMailReqDto {
  @ApiProperty({ example: 'example@example.com' })
  @IsEmail()
  @Length(2, 20)
  @Transform(TransformHelper.trim)
  to: string;

  @ApiProperty({ example: 'Title text' })
  @IsString()
  @Length(2, 50)
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @Type(() => String)
  subject: string;

  @ApiProperty({ example: 'Text for mail' })
  @IsString()
  @Length(2, 400)
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @Type(() => String)
  text: string;
}
