import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, Length, Max, Min } from 'class-validator';

import { TransformHelper } from '../../../../common';
import { ColorCarEnum, CurrencyEnum } from '../../../../database/enums';

export class BaseCarReqDto {
  @ApiProperty({ example: 'Car Title' })
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  title: string;

  @ApiProperty({ example: 'Car Description' })
  @IsString()
  @Length(3, 300)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  description: string;

  @ApiProperty({ example: 'Car brand' })
  @IsString()
  @Length(2, 30)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  brand: string;

  @ApiProperty({ example: 'Car model' })
  @IsString()
  @Length(2, 30)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  model: string;

  @ApiProperty({ example: 'red' })
  @IsEnum(ColorCarEnum)
  @Length(2, 20)
  @Transform(TransformHelper.trim)
  @Type(() => IsEnum)
  color: ColorCarEnum;

  @ApiProperty({ example: 20000 })
  @IsNumber()
  @Min(1)
  @Max(100000000)
  @Type(() => Number)
  start_price: number;

  @ApiProperty({ example: 20000 })
  @IsNumber()
  @Min(1)
  @Max(100000000)
  @Type(() => Number)
  update_price?: number;

  @ApiProperty({ example: 'USD' })
  @IsEnum(CurrencyEnum)
  @Type(() => IsEnum)
  currency: CurrencyEnum;

  @ApiProperty({ example: 2021 })
  @IsNumber()
  @Min(1990)
  @Max(new Date().getFullYear())
  @Type(() => Number)
  year: number;
}
