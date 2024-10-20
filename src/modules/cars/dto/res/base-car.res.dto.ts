import { ApiProperty } from '@nestjs/swagger';

import { ColorCarEnum, CurrencyEnum } from '../../../../database/enums';

export class BaseCarResDto {
  @ApiProperty({
    example: '796cea24-a328-4463-a5e1-85a779e4780f',
    description: 'Car id',
  })
  id: string;

  @ApiProperty({
    example: 'http://localhost:3500/images/car_photo.png',
    description: 'Image URL',
  })
  photo: string;

  @ApiProperty({
    example: 'Car Title',
    description: 'Car Title',
  })
  title: string;

  @ApiProperty({
    example: 'Car Description',
    description: 'Car Description',
  })
  description: string;

  @ApiProperty({ example: 'City name' })
  city: string;

  @ApiProperty({ example: 'Car brand' })
  brand: string;

  @ApiProperty({ example: 'Car model' })
  model: string;

  @ApiProperty({
    example: 'red',
    description: 'Car color',
  })
  color: ColorCarEnum;

  @ApiProperty({
    example: 10000,
    description: 'Car price',
  })
  start_price: number;

  @ApiProperty({
    example: 12000,
    description: 'Car price',
  })
  update_price: number;

  @ApiProperty({
    example: 'USD',
    description: 'Currency',
  })
  currency: CurrencyEnum;

  @ApiProperty({
    example: 2020,
    description: 'Car made year',
  })
  year: number;

  @ApiProperty({
    example: true,
    description: 'Active',
  })
  active: boolean;

  @ApiProperty({
    example: '2021-09-29T10:00:00.000Z',
    description: 'Car Created Date',
  })
  created: Date;

  @ApiProperty({
    example: '2021-09-29T10:00:00.000Z',
    description: 'Car Updated Date',
  })
  updated: Date;

  @ApiProperty({})
  start_currencies_rate: string[];

  @ApiProperty({})
  user_id: string;
}
