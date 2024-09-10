import { ApiProperty } from '@nestjs/swagger';

export class BaseModelResDto {
  @ApiProperty({
    example: 'Audi',
    description: 'Brand name',
  })
  name?: string;

  @ApiProperty({})
  brand_id?: string;
}
