import { PickType } from '@nestjs/swagger';

import { BaseUserResDto } from './base-user.res.dto';

export class UserResPublicDto extends PickType(BaseUserResDto, [
  'id',
  'image',
  'name',
  'phone',
  'email',
  'cars',
  'createdAt',
]) {}
