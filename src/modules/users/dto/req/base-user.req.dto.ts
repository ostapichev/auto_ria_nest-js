import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean, IsEmail, IsEnum, isEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { TransformHelper } from '../../../../common';
import {
  AccountTypeEnum,
  UserRoleEnum,
} from '../../../../database/entities/enums';

export class BaseUserReqDto {
  @ApiProperty({ example: 'http://localhost:3000/images/avatar.png' })
  @IsOptional()
  @IsString()
  @Length(10, 500)
  @Type(() => String)
  image?: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @Length(2, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  name: string;

  @ApiProperty({ example: '380671234567' })
  @IsString()
  @Length(12)
  @Transform(TransformHelper.trim)
  @Matches(/^\d{12}$/)
  @Type(() => String)
  phone: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  @Length(0, 300)
  @Transform(TransformHelper.trim)
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  @Type(() => IsEmail)
  email: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  @IsString()
  @Length(0, 300)
  @Transform(TransformHelper.trim)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  @Type(() => String)
  password: string;

  @ApiProperty({ example: 'user_buy' })
  @IsEnum(UserRoleEnum)
  @Length(3, 50)
  @Type(() => isEnum)
  role?: UserRoleEnum;

  @ApiProperty({ example: 'basic' })
  @IsEnum(AccountTypeEnum)
  @Length(3, 50)
  @Type(() => isEnum)
  account?: AccountTypeEnum;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @Type(() => Number)
  balance?: number;

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
  status?: boolean;
}
