import { ApiProperty } from '@nestjs/swagger';

export class BaseCityResDto {
  @ApiProperty({
    example: 'Kharkiv',
    description: 'City name',
  })
  name: string;
}
