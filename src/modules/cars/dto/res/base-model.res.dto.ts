import { ApiProperty } from '@nestjs/swagger';

export class BaseModelResDto {
  @ApiProperty({
    example: 'f1ba3093-e0bd-478f-a104-33e13d6257b4',
    description: 'Model id',
  })
  id: string;

  @ApiProperty({
    example: 'q5',
    description: 'Model name',
  })
  name: string;

  @ApiProperty({
    example: 'a2be8f70-73b2-4967-ac43-52b583aee210',
    description: 'The model belongs to the brand with this id',
  })
  brand_id: string;
}
