import { ApiProperty } from '@nestjs/swagger';

export class BaseBrandResDto {
  @ApiProperty({
    example: 'Audi',
    description: 'Brand name',
  })
  name: string;
}
