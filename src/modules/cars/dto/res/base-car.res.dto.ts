import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: 'Car brand' })
  brand: string;

  @ApiProperty({ example: 'Car model' })
  model: string;

  @ApiProperty({
    example: 'Car color',
    description: 'Car color',
  })
  color: string;

  @ApiProperty({
    example: 10000,
    description: 'Car price',
  })
  price: number;

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
    description: 'Article Created Date',
  })
  created: Date;

  @ApiProperty({
    example: '2021-09-29T10:00:00.000Z',
    description: 'Article Updated Date',
  })
  updated: Date;

  @ApiProperty({})
  user_id: string;
}
