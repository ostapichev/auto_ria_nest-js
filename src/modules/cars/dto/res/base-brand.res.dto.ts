import { ApiProperty } from '@nestjs/swagger';

import { ModelCarEntity } from '../../../../database/entities';

export class BaseBrandResDto {
  @ApiProperty({
    example: 'f1ba3093-e0bd-478f-a104-33e13d6257b4',
    description: 'Message id',
  })
  id: string;

  @ApiProperty({
    example: 'Brand name here',
    description: 'Brand name',
  })
  name: string;

  @ApiProperty({
    example: 'Model name here',
    description: 'Models name in the brand',
  })
  models?: ModelCarEntity[];
}
