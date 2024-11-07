import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { TransformHelper } from '../../../../common';
import {
  AccountTypeEnum,
  GenderEnum,
  UserRoleEnum,
} from '../../../../database/enums';

export class BaseUserReqDto {
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
  @Length(3, 30)
  @Transform(TransformHelper.trim)
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  @Type(() => IsEmail)
  email: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  @IsString()
  @Length(8, 20)
  @Transform(TransformHelper.trim)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  @Type(() => String)
  password: string;

  @ApiProperty({ example: 'user_buy' })
  @IsEnum(UserRoleEnum)
  @Type(() => IsEnum)
  role?: UserRoleEnum;

  @ApiProperty({ example: 'male' })
  @IsEnum(GenderEnum)
  @Type(() => IsEnum)
  gender: GenderEnum;

  @ApiProperty({ example: 'basic' })
  @IsEnum(AccountTypeEnum)
  @Type(() => IsEnum)
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
