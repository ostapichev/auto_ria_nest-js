import { ApiProperty } from '@nestjs/swagger';

import {
  AccountTypeEnum,
  GenderEnum,
  UserRoleEnum,
} from '../../../../database/enums';

export class BaseUserResDto {
  @ApiProperty({
    example: '796cea24-a328-4463-a5e1-85a779e4780f',
    description: 'User id',
  })
  id: string;

  @ApiProperty({
    example: 'http://localhost:3500/images/car_photo.png',
    description: 'Image URL',
  })
  image: string;

  @ApiProperty({
    example: 'User name',
    description: 'User name',
  })
  name: string;

  @ApiProperty({
    example: '380983456789',
    description: 'Phone user',
  })
  phone: string;

  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Email user',
  })
  email: string;

  @ApiProperty({
    example: 'buyer',
    description: 'role user',
  })
  role: UserRoleEnum;

  @ApiProperty({
    example: 'male',
    description: 'gender user',
  })
  gender: GenderEnum;

  @ApiProperty({
    example: 'basic',
    description: 'Account type',
  })
  account: AccountTypeEnum;

  @ApiProperty({
    example: '1000',
    description: 'User balance',
  })
  balance?: number;

  @ApiProperty({
    example: 'true',
  })
  status: boolean;

  @ApiProperty({
    example: '796cea24-a328-4463-a5e1-85a779e4780f',
    description: 'car id',
  })
  cars?: string[];

  @ApiProperty({
    example: '2024-09-17T19:39:48.603Z',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-09-17T19:39:48.603Z',
  })
  updatedAt: Date;
}
