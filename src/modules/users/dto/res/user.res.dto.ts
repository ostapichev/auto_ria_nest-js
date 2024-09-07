import { PickType } from '@nestjs/swagger';

import { BaseUserResDto } from './base-user.res.dto';

export class UserResDto extends PickType(BaseUserResDto, [
  'id',
  'image',
  'name',
  'phone',
  'email',
  'role',
  'account',
  'balance',
  'createdAt',
  'updatedAt',
]) {}
