import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { AccountTypeEnum } from '../../../../database/entities/enums/account-type.enum';
import { UserRoleEnum } from '../../../../database/entities/enums/user-role.enum';

export class BaseUserReqDto {
  @ApiProperty({ example: 'http://localhost:3000/images/avatar.png' })
  @IsOptional()
  @IsString()
  @Length(10, 500)
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
  phone: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsString()
  @Length(0, 300)
  @Transform(TransformHelper.trim)
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  email: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  @IsString()
  @Length(0, 300)
  @Transform(TransformHelper.trim)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  password: string;

  @ApiProperty({ example: 'user_buy' })
  @IsString()
  @Length(3, 50)
  @Type(() => String)
  role?: UserRoleEnum;

  @ApiProperty({ example: 'basic' })
  @IsString()
  @Length(3, 50)
  @Type(() => String)
  account?: AccountTypeEnum;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @Type(() => Number)
  balance?: number;
}
