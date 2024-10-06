import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

import { TransformHelper } from '../../../../common';

export class ListQueryDto {
  @IsInt()
  @Max(100)
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsString()
  @IsOptional()
  @Type(() => String)
  search?: string;

  @ApiProperty()
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsOptional()
  @IsUUID()
  @Type(() => IsUUID)
  cityId?: string;
}
