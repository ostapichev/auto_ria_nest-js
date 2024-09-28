import { ApiProperty } from '@nestjs/swagger';

export class BaseModelResDto {
  @ApiProperty({
    example: 'Audi',
    description: 'Brand name',
  })
  name?: string;

  @ApiProperty({
    example: 'a2be8f70-73b2-4967-ac43-52b583aee210',
    description: 'The model belongs to the brand with this id',
  })
  brand_id?: string;
}
