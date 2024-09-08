import { PickType } from '@nestjs/swagger';

import { BaseUserResDto } from './base-user.res.dto';

export class SuperUserResDto extends PickType(BaseUserResDto, [
  'id',
  'name',
  'phone',
  'email',
  'role',
  'account',
]) {}
