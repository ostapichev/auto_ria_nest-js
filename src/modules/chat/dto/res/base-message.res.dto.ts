import { ApiProperty } from '@nestjs/swagger';

export class BaseMessageResDto {
  @ApiProperty({
    example: 'f1ba3093-e0bd-478f-a104-33e13d6257b4',
    description: 'Message id',
  })
  id: string;

  @ApiProperty({
    example: 'Your text here',
    description: 'Content message',
  })
  content: string;

  @ApiProperty({
    example: '17648de5-d528-42b2-b392-c4e863e08f6c',
    description: 'To user id',
  })
  to_user_id: string;

  @ApiProperty({
    example: '17648de5-d528-42b2-b392-c4e863e08f6c',
    description: 'From user id',
  })
  from_user_id: string;
}
