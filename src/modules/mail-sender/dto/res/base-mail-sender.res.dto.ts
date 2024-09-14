import { ApiProperty } from '@nestjs/swagger';

export class BaseMailSenderResDto {
  @ApiProperty({
    example: 'Email sent successfully',
  })
  message: string;
}
