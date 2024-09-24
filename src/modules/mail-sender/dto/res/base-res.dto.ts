import { ApiProperty } from '@nestjs/swagger';

export class BaseResDto {
  @ApiProperty()
  message: string;
}
