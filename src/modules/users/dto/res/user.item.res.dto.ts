import { PickType } from '@nestjs/swagger';

import { BaseUserResDto } from './base-user.res.dto';

export class UserResItemDto extends PickType(BaseUserResDto, [
  'id',
  'image',
  'name',
  'phone',
  'email',
  'role',
  'gender',
  'account',
  'balance',
  'status',
  'createdAt',
  'updatedAt',
]) {}
