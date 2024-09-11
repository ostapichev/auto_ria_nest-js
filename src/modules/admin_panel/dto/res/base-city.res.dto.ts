import { ApiProperty } from '@nestjs/swagger';

export class BaseCityResDto {
  @ApiProperty({
    example: 'f1ba3093-e0bd-478f-a104-33e13d6257b4',
    description: 'City id',
  })
  id: string;

  @ApiProperty({
    example: 'Kharkiv',
    description: 'City name',
  })
  name: string;
}
